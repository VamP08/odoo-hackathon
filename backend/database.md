# ReWear Database README

This document provides an overview of the PostgreSQL schema for the ReWear platform, guidance on stored procedures (methods) for common operations, and instructions for backend developers on how to interact with the database.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Schema Overview](#schema-overview)
3. [Stored Procedures (Methods)](#stored-procedures-methods)
4. [Workflow Examples](#workflow-examples)
5. [API & Backend Guidelines](#api--backend-guidelines)
6. [Naming Conventions](#naming-conventions)
7. [Contact & Support](#contact--support)

---

## Getting Started

1. **Clone the repo** and ensure you have PostgreSQL 16+ installed.
2. **Create the database** (e.g. `rewear`) and user if needed.
3. **Run migrations**:  
   Use the SQL in `postgres.sql` to create all tables, types, triggers, and functions.  
   You can use pgAdmin, TablePlus, DBeaver, or `psql` CLI.
4. **Verify** that all tables, types, triggers, and functions are present:

   ```sql
   \d                  -- tables
   \dT+                -- types
   SELECT proname FROM pg_proc WHERE proname LIKE 'fn_%';
   ```

---

## Schema Overview

> See `postgres.sql` for full definitions.

* **Extensions & Enums**: `pgcrypto`, `user_role`, `item_status`, `swap_status`, `redemption_status`.
* **Core Tables**:  
  - `users`
  - `oauth_accounts`
  - `password_resets`
  - `categories`
  - `tags`
  - `items`
  - `item_images`
  - `item_tags`
  - `swaps`
  - `redemptions`
  - `points_transactions`
  - `favorites`
  - `reviews`
* **Triggers & Indexes**:  
  - `touch_updated_at` (auto-update `updated_at` columns)
  - Full-text search trigger on `items.search_vector`
  - GIN index and foreign-key/status indexes

---

## Stored Procedures (Methods)

To simplify backend code and enforce business logic at the database level, we've defined the following PL/pgSQL functions. Your backend should call these as methods rather than writing raw SQL.

### 1. User Signup

```sql
CREATE OR REPLACE FUNCTION fn_signup_user(
  p_email TEXT,
  p_password_hash TEXT,
  p_full_name TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE new_id UUID;
BEGIN
  INSERT INTO users (email, password_hash, full_name)
  VALUES (p_email, p_password_hash, p_full_name)
  RETURNING id INTO new_id;
  RETURN new_id;
EXCEPTION WHEN unique_violation THEN
  RAISE EXCEPTION 'Email already registered';
END;
$$ LANGUAGE plpgsql;
```

**Call from backend:**
```js
const { rows } = await db.query(
  `SELECT fn_signup_user($1, $2, $3) AS user_id`,
  [email, hashedPassword, fullName]
);
```
Returns the new user's `id` or throws an error if the email exists.

---

### 2. Password Reset Request

```sql
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
```

**Call:** `SELECT fn_create_password_reset($userId, $token, $expiry);`

---

### 3. List a New Item

```sql
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
```

**Call:**  
```js
const { rows } = await db.query(
  `SELECT fn_list_item($1, $2, $3, $4, $5, $6, $7) AS item_id`,
  [ownerId, categoryId, title, description, size, condition, pointCost]
);
```

---

### 4. Request a Swap

```sql
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
```

**Call:**  
```js
const { rows } = await db.query(
  `SELECT fn_request_swap($1, $2, $3) AS swap_id`,
  [requesterId, requestedItemId, offeredItemId]
);
```

---

### 5. Approve Redemption

```sql
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
```

**Call:**  
```js
await db.query('SELECT fn_approve_redemption($1)', [redemptionId]);
```

---

## Workflow Examples

Instead of raw SQL, your backend should call these stored procedures:

* **Signup**: `SELECT fn_signup_user(email, passwordHash, fullName);`
* **List Item**: `SELECT fn_list_item(ownerId, categoryId, title, desc, size, cond, cost);`
* **Swap Request**: `SELECT fn_request_swap(userId, requestedItemId, offeredItemId);`
* **Approve Redemption**: `SELECT fn_approve_redemption(redemptionId);`

For other actions (e.g., accepting swaps, adding favorites, writing reviews), you can similarly wrap in functions or execute parameterized queries following the patterns above.

---

## API & Backend Guidelines

* **Use transactions** when calling any multi-step method (e.g., swap acceptance).
* **Error handling**: PL/pgSQL functions will throw exceptions; catch and map them to appropriate HTTP error codes.
* **Parameterization**: Always pass parameters, never interpolate values directly.
* **Connection pooling**: Use a pool (e.g., pg-pool) to manage DB connections.
* **Do not use direct SQL for mutations**—always use the provided stored procedures for core flows.

---

## Naming Conventions

* **Stored functions**: prefix with `fn_` and action name in `snake_case`.
* **Tables** & **columns**: `snake_case`, plural tables.

---

## Project Structure Reference

Your backend is organized as follows:

```
backend/
  controllers/
    item.controller.js
    point.controller.js
    redemption.controller.js
    swap.controller.js
    user.controller.js
  middleware/
    auth.js
    errorHandler.js
  models/
    Item.js
    PointTransaction.js
    Redemption.js
    Swap.js
    User.js
  routes/
    item.route.js
    point.route.js
    swap.route.js
    user.route.js
  db.js
  index.js
  package.json
  postgres.sql
  database.md
```

- **All controllers** should use the `db.js` helper and call stored procedures for mutations.
- **All routes** are defined in the `routes/` directory and map to controller methods.
- **No message model or route** is present, as messaging is not part of the current app.

---

## Contact & Support

For schema changes or backend integration questions, contact the project maintainer or open an issue in the repository.