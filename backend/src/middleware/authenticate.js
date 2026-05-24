const jwt = require('jsonwebtoken');

// Verifies the Bearer token in the Authorization header.
// Attaches the decoded payload as req.user so controllers know who's calling.
function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = auth.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token — please log in again' });
  }
}

module.exports = { authenticate };
