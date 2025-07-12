import { query } from '../db.js';

// Get all point transactions for the authenticated user
export const getAllPointTransactions = async (req, res, next) => {
  try {
    // Assuming req.user.id is set by auth middleware
    const result = await query(
      'SELECT * FROM points_transactions WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Get a specific point transaction by ID (only if it belongs to the user)
export const getPointTransactionById = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM points_transactions WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Create a new point transaction (example: admin/manual adjustment)
export const createPointTransaction = async (req, res, next) => {
  const { changeAmount, transactionType, referenceId } = req.body;
  try {
    const result = await query(
      `INSERT INTO points_transactions (user_id, change_amount, transaction_type, reference_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user.id, changeAmount, transactionType, referenceId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};