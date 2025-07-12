-- 1. Extensions & Enums
--------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE user_role    AS ENUM ('user','admin');
CREATE TYPE item_status  AS ENUM ('available','pending_swap','pending_redemption','swapped','redeemed','archived');
CREATE TYPE swap_status  AS ENUM ('pending','accepted','rejected','cancelled');
CREATE TYPE redemption_status AS ENUM ('pending','approved','rejected','cancelled');


-- 2. Users & Authentication
--------------------------------------------------
CREATE TABLE users (
  id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  email          TEXT         NOT NULL UNIQUE,
  password_hash  TEXT         NOT NULL,
  full_name      TEXT,
  avatar_url     TEXT,
  role           user_role    NOT NULL DEFAULT 'user',
  points_balance INT          NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Social logins (OAuth)
CREATE TABLE oauth_accounts (
  id                 UUID       PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider           TEXT       NOT NULL,         -- e.g. 'google','facebook'
  provider_user_id   TEXT       NOT NULL,         -- user’s ID at provider
  access_token       TEXT,
  refresh_token      TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(provider, provider_user_id)
);

-- Password reset tokens
CREATE TABLE password_resets (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reset_token    TEXT        NOT NULL UNIQUE,
  expires_at     TIMESTAMPTZ NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- 3. Categories, Tags & Search
--------------------------------------------------
CREATE TABLE categories (
  id          SERIAL PRIMARY KEY,
  name        TEXT   NOT NULL UNIQUE
);

CREATE TABLE tags (
  id   SERIAL PRIMARY KEY,
  name TEXT   NOT NULL UNIQUE
);

CREATE TABLE items (
  id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id       UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id    INT          REFERENCES categories(id),
  title          TEXT         NOT NULL,
  description    TEXT,
  size           TEXT,
  condition      TEXT,
  status         item_status  NOT NULL DEFAULT 'available',
  point_cost     INT,
  search_vector  tsvector,
  is_approved    BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Full‑text search index
CREATE INDEX idx_items_search ON items USING GIN(search_vector);

-- Trigger to keep search_vector up-to-date
CREATE FUNCTION items_search_vector_trigger() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    to_tsvector('english', coalesce(NEW.title,'') || ' ' || coalesce(NEW.description,''));
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_items_search_vector
  BEFORE INSERT OR UPDATE ON items
  FOR EACH ROW EXECUTE FUNCTION items_search_vector_trigger();

CREATE TABLE item_tags (
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  tag_id  INT  REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (item_id, tag_id)
);

CREATE TABLE item_images (
  id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id    UUID         NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  image_url  TEXT         NOT NULL,
  sort_order INT          NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);


-- 4. Swap & Redemption
--------------------------------------------------
CREATE TABLE swaps (
  id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id      UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  requested_item_id UUID          NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  offered_item_id   UUID          REFERENCES items(id),
  status            swap_status   NOT NULL DEFAULT 'pending',
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE TABLE redemptions (
  id           UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID               NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id      UUID               NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  status       redemption_status  NOT NULL DEFAULT 'pending',
  created_at   TIMESTAMPTZ        NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ        NOT NULL DEFAULT now()
);


-- 5. Points Ledger
--------------------------------------------------
CREATE TABLE points_transactions (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  change_amount  INT         NOT NULL,            -- + or –
  transaction_type TEXT     NOT NULL,            -- e.g. 'earn_listing','redeem_item'
  reference_id   UUID,                          -- swap or redemption id
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- 6. Favorites & Reviews
--------------------------------------------------
CREATE TABLE favorites (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, item_id)
);

CREATE TABLE reviews (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id  UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id  UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id      UUID        REFERENCES items(id) ON DELETE SET NULL,
  rating       INT CHECK (rating BETWEEN 1 AND 5),
  comment      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- 7. Triggers for updated_at
--------------------------------------------------
CREATE FUNCTION touch_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach to tables with updated_at
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE TRIGGER trg_items_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE TRIGGER trg_swaps_updated_at
  BEFORE UPDATE ON swaps
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE TRIGGER trg_redemptions_updated_at
  BEFORE UPDATE ON redemptions
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();


-- 8. Indexes
--------------------------------------------------
CREATE INDEX ON items (owner_id);
CREATE INDEX ON items (status);
CREATE INDEX ON swaps (requester_id, status);
CREATE INDEX ON redemptions (user_id, status);
CREATE INDEX ON points_transactions (user_id);

-- 4.1 User Signup
CREATE OR REPLACE FUNCTION fn_signup_user(
  p_email TEXT,
  p_password_hash TEXT,
  p_full_name TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO users (email, password_hash, full_name)
  VALUES (p_email, p_password_hash, p_full_name)
  RETURNING id INTO new_id;
  RETURN new_id;
EXCEPTION WHEN unique_violation THEN
  RAISE EXCEPTION 'Email already registered';
END;
$$ LANGUAGE plpgsql;
-- (Postgres 17: CREATE OR REPLACE FUNCTION preserves ownership/permissions) :contentReference[oaicite:0]{index=0}

-- 4.2 Password Reset
CREATE OR REPLACE FUNCTION fn_create_password_reset(
  p_user_id UUID,
  p_token TEXT,
  p_expires_at TIMESTAMPTZ
) RETURNS VOID AS $$
BEGIN
  INSERT INTO password_resets (user_id, reset_token, expires_at)
  VALUES (p_user_id, p_token, p_expires_at);
END;
$$ LANGUAGE plpgsql;

-- 4.3 List Item
CREATE OR REPLACE FUNCTION fn_list_item(
  p_owner_id UUID,
  p_category_id INT,
  p_title TEXT,
  p_description TEXT,
  p_size TEXT,
  p_condition TEXT,
  p_point_cost INT
) RETURNS UUID AS $$
DECLARE
  item_id UUID;
BEGIN
  INSERT INTO items (
    owner_id, category_id, title, description,
    size, condition, point_cost, is_approved
  )
  VALUES (
    p_owner_id, p_category_id, p_title, p_description,
    p_size, p_condition, p_point_cost, FALSE
  )
  RETURNING id INTO item_id;
  RETURN item_id;
END;
$$ LANGUAGE plpgsql;

-- 4.4 Request Swap
CREATE OR REPLACE FUNCTION fn_request_swap(
  p_requester UUID,
  p_requested_item UUID,
  p_offered_item UUID DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  swap_id UUID;
BEGIN
  INSERT INTO swaps (requester_id, requested_item_id, offered_item_id)
  VALUES (p_requester, p_requested_item, p_offered_item)
  RETURNING id INTO swap_id;
  RETURN swap_id;
END;
$$ LANGUAGE plpgsql;

-- 4.5 Approve Redemption
CREATE OR REPLACE FUNCTION fn_approve_redemption(
  p_redemption_id UUID
) RETURNS VOID AS $$
DECLARE
  rec RECORD;
BEGIN
  SELECT user_id, item_id
    INTO rec
    FROM redemptions
   WHERE id = p_redemption_id;

  UPDATE users
     SET points_balance = points_balance
                           - (SELECT point_cost FROM items WHERE id = rec.item_id)
   WHERE id = rec.user_id;

  UPDATE redemptions
     SET status = 'approved', updated_at = now()
   WHERE id = p_redemption_id;

  INSERT INTO points_transactions (
    user_id, change_amount, transaction_type, reference_id
  ) VALUES (
    rec.user_id,
    - (SELECT point_cost FROM items WHERE id = rec.item_id),
    'redeem_item',
    p_redemption_id
  );
END;
$$ LANGUAGE plpgsql;

