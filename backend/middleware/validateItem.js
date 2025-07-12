
export default function (req, res, next) {
  const { title, categoryId, pointCost } = req.body;
  if (!title || !categoryId || typeof pointCost !== 'number') {
    return res.status(400).json({ error: 'Missing or invalid fields for item' });
  }
  next();
};