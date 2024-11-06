const jwt = require('jsonwebtoken');

const tokenAuthMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Invalid token' }); // Adjusted to match the expected error message
  }

  try {
    const tokenValue = token.split(' ')[1];  // Extract the token after 'Bearer'
    jwt.verify(tokenValue, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Access denied' }); // Adjusted to match the expected error message
  }
};

module.exports = tokenAuthMiddleware;
