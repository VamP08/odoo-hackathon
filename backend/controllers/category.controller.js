import { query } from '../db.js';

export const getAllCategories = async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM categories ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  const { name } = req.body;
  try {
    const result = await query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};
