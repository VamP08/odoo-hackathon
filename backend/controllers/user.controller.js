
import db from '../db';

export const getAllUsers = async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, email, full_name, avatar_url, role, points_balance, created_at FROM users');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const getUserById = (req, res) => res.json({});

export const createUser = async (req, res, next) => {
  const { email, passwordHash, fullName } = req.body;
  try {
    const result = await db.query(
      'SELECT fn_signup_user($1, $2, $3) AS user_id',
      [email, passwordHash, fullName]
    );
    res.status(201).json({ id: result.rows[0].user_id });
  } catch (err) {
    next(err);
  }
};

export const updateUser = (req, res) => res.json({});

export const deleteUser = (req, res) => res.status(204).end();