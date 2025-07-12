const Item = require('../models/Item');
const items = []; // Fill with sample items

exports.getAllItems = (req, res) => res.json(items);
exports.getItemById = (req, res) => {
  const item = items.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
};
// Add create, update, delete, approve, etc.