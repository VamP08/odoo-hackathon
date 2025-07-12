import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

export const signup = async (req, res, next) => {
  const { email, password, name } = req.body;
  const fullName = name;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      'SELECT fn_signup_user($1, $2, $3) AS user_id',
      [email, hashedPassword, fullName]
    );
    const userId = result.rows[0].user_id;
    
    // Get the full user data
    const userResult = await query(
      'SELECT id, email, full_name, avatar_url, role, points_balance, created_at FROM users WHERE id = $1',
      [userId]
    );
    const newUser = userResult.rows[0];
    const token = generateToken(newUser);
    res.status(201).json({ user: newUser, token });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid email or password' });

    const token = generateToken(user);
    delete user.password_hash;
    res.json({ user, token });
  } catch (err) {
    next(err);
  }
};
