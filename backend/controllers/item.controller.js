import { query } from '../db.js';

// Get all items
export const getAllItems = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM items ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Get item by ID
export const getItemById = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM items WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Create item (uses stored procedure)
export const createItem = async (req, res, next) => {
  const { ownerId, categoryId, title, description, size, condition, pointCost } = req.body;
  try {
    const result = await query(
      'SELECT fn_list_item($1, $2, $3, $4, $5, $6, $7) AS item_id',
      [ownerId, categoryId, title, description, size, condition, pointCost]
    );
    res.status(201).json({ id: result.rows[0].item_id });
  } catch (err) {
    next(err);
  }
};

// Update item
export const updateItem = async (req, res, next) => {
  const { title, description, size, condition, pointCost } = req.body;
  try {
    const result = await query(
      `UPDATE items
       SET title = $1, description = $2, size = $3, condition = $4, point_cost = $5, updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [title, description, size, condition, pointCost, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Delete item
export const deleteItem = async (req, res, next) => {
  try {
    const result = await query(
      'DELETE FROM items WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export const getFeaturedItems = async (req, res) => {
  try {
    const result = await query(`
      SELECT i.*, COUNT(sr.id) AS swap_count
      FROM items i
      LEFT JOIN swap_requests sr ON i.id = sr.requestedItemId
      WHERE i.approved = true
      GROUP BY i.id
      ORDER BY swap_count DESC
      LIMIT 3
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching featured items:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}