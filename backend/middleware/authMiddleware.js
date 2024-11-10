import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      console.log('No token provided in request');
      return res.status(401).json({ message: 'Not authorized - No token' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        console.log('User not found for token:', decoded.id);
        return res.status(401).json({ message: 'User no longer exists' });
      }

      next();
    } catch (error) {
      console.log('Token verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized - Invalid token' });
    }
  } catch (error) {
    console.log('Auth middleware error:', error.message);
    res.status(401).json({ message: 'Not authorized - Server error' });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'You do not have permission to perform this action' 
      });
    }
    next();
  };
}; 