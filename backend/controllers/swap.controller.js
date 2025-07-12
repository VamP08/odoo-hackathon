import db from '../db.js';

// Get all swaps for the authenticated user (as requester or owner)
export const getAllSwaps = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT * FROM swaps WHERE requester_id = $1 OR requested_item_id IN 
        (SELECT id FROM items WHERE owner_id = $1)
       ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Get a specific swap by ID (only if user is involved)
export const getSwapById = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT * FROM swaps WHERE id = $1 AND (requester_id = $2 OR requested_item_id IN 
        (SELECT id FROM items WHERE owner_id = $2))`,
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Swap not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Create a new swap request
export const createSwap = async (req, res, next) => {
  const { requestedItemId, offeredItemId } = req.body;
  try {
    const result = await db.query(
      'SELECT fn_request_swap($1, $2, $3) AS swap_id',
      [req.user.id, requestedItemId, offeredItemId]
    );
    res.status(201).json({ id: result.rows[0].swap_id });
  } catch (err) {
    next(err);
  }
};

// Update swap status (e.g., accept, reject, cancel)
export const updateSwap = async (req, res, next) => {
  const { status } = req.body;
  try {
    const result = await db.query(
      `UPDATE swaps SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Swap not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Delete a swap (only if user is involved)
export const deleteSwap = async (req, res, next) => {
  try {
    const result = await db.query(
      `DELETE FROM swaps WHERE id = $1 AND (requester_id = $2 OR requested_item_id IN 
        (SELECT id FROM items WHERE owner_id = $2)) RETURNING id`,
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Swap not found' });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};