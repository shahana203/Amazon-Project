// const jwt = require('jsonwebtoken');

// function authMiddleware(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) return res.status(401).json({ error: 'No token provided' });
//   const token = authHeader.split(' ')[1];
//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = payload.userId; // assign user's MongoDB ID to request
//     next();
//   } catch (e) {
//     res.status(401).json({ error: 'Invalid token' });
//   }
// }

// module.exports = authMiddleware;


const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId; // assign user's MongoDB ID to request
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = authMiddleware;

