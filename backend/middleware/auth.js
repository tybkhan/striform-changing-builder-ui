const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      // Development mode: Create a consistent development user
      req.user = { 
        userId: 'dev_user_123',
        email: 'dev@example.com',
        name: 'Development User',
        isPro: true
      };
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      // If token verification fails, fall back to dev user in development
      if (process.env.NODE_ENV !== 'production') {
        req.user = { 
          userId: 'dev_user_123',
          email: 'dev@example.com',
          name: 'Development User',
          isPro: true
        };
        return next();
      }
      throw new AppError('Invalid token', 401);
    }
  } catch (error) {
    next(error);
  }
};