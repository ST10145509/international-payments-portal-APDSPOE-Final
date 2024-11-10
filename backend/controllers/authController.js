import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

export const authController = {
  async register(req, res) {
    try {
      console.log('Received registration data:', req.body);
      
      const { fullName, idNumber, accountNumber, email, password } = req.body;

      // Check if user already exists
      const userExists = await User.findOne({ 
        $or: [{ idNumber }, { accountNumber }, { email }] 
      });

      if (userExists) {
        console.log('User exists with:', { idNumber, accountNumber, email });
        return res.status(400).json({ 
          message: 'User already exists with these credentials' 
        });
      }

      // Create user
      const user = await User.create({
        fullName,
        idNumber,
        accountNumber,
        email,
        password,
        role: 'customer'
      });

      const token = generateToken(user._id);
      console.log('User created successfully:', user._id);

      res.status(201).json({
        id: user._id,
        fullName: user.fullName,
        accountNumber: user.accountNumber,
        email: user.email,
        role: user.role,
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ message: error.message });
    }
  },

  async login(req, res) {
    try {
      const { accountNumber, password } = req.body;

      // Find user and include password for comparison
      const user = await User.findOne({ accountNumber }).select('+password');

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = generateToken(user._id);

      res.json({
        id: user._id,
        fullName: user.fullName,
        accountNumber: user.accountNumber,
        email: user.email,
        role: user.role,
        token
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}; 