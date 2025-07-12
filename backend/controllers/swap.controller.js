
import db from '../db.js';

export const getAllSwaps = (req, res) => res.json([]);
export const getSwapById = (req, res) => res.json({});
export const createSwap = async (req, res, next) => {
  const { requesterId, requestedItemId, offeredItemId } = req.body;
  try {
    const result = await db.query(
      'SELECT fn_request_swap($1, $2, $3) AS swap_id',
      [requesterId, requestedItemId, offeredItemId]
    );
    res.status(201).json({ id: result.rows[0].swap_id });
  } catch (err) {
    next(err);
  }
};
export const updateSwap = (req, res) => res.json({});
export const deleteSwap = (req, res) => res.status(204).end();