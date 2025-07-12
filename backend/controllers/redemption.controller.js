import db from '../db.js';

// Approve a redemption request (admin action)
export const approveRedemption = async (req, res, next) => {
  const { redemptionId } = req.body;
  try {
    await db.query('SELECT fn_approve_redemption($1)', [redemptionId]);
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};