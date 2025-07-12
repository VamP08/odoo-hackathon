import db from '../db';;
import Item from '../models/item.model';

const items = []; // Fill with sample items

export const getAllItems = (req, res) => res.json([]);
export const getItemById = (req, res) => res.json({});
export const createItem = async (req, res, next) => {
  const { ownerId, categoryId, title, description, size, condition, pointCost } = req.body;
  try {
    const result = await db.query(
      'SELECT fn_list_item($1, $2, $3, $4, $5, $6, $7) AS item_id',
      [ownerId, categoryId, title, description, size, condition, pointCost]
    );
    res.status(201).json({ id: result.rows[0].item_id });
  } catch (err) {
    next(err);
  }
};
export const updateItem = (req, res) => res.json({});
export const deleteItem = (req, res) => res.status(204).end();