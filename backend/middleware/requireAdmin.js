
export default function (req, res, next) {
  // Assumes req.user is set by auth middleware
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  }
  next();
};