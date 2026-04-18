// Admin middleware – must be used AFTER the auth middleware
module.exports = function (req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
  }
  next();
};
