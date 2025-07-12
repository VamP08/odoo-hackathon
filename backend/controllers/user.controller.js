import { query } from '../db.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const result = await query('SELECT id, email, full_name, avatar_url, role, points_balance, created_at FROM users');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT id, email, full_name, avatar_url, role, points_balance, created_at FROM users WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  const { email, passwordHash, fullName } = req.body;
  try {
    const result = await query(
      'SELECT fn_signup_user($1, $2, $3) AS user_id',
      [email, passwordHash, fullName]
    );
    res.status(201).json({ id: result.rows[0].user_id });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  const { fullName, avatarUrl } = req.body;
  try {
    const result = await query(
      `UPDATE users
       SET full_name = $1, avatar_url = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING id, email, full_name, avatar_url, role, points_balance, created_at`,
      [fullName, avatarUrl, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const result = await query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};