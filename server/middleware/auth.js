const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    console.log('Auth headers:', req.headers);
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid auth header found');
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token found:', token ? 'Yes' : 'No');
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Fetch full user data from database
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      req.user = user; // Use full user object instead of just decoded token data
      next();
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      return res.status(401).json({ 
        message: 'Invalid or expired token',
        details: jwtError.message 
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      message: 'Authentication error',
      details: error.message 
    });
  }
};

module.exports = authMiddleware; 