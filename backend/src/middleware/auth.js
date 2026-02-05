const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer '))
    return res.status(401).json({ success: false, message: 'No token provided.' });

  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

const authorizeRoles = (...allowed) => (req, res, next) => {
  if (!allowed.includes(req.user.role))
    return res.status(403).json({ success: false, message: 'Access denied.' });
  next();
};

module.exports = { verifyToken, authorizeRoles };
