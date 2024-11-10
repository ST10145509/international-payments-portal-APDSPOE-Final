import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    validate: {
      validator: (value) => /^[a-zA-Z ]{2,50}$/.test(value),
      message: 'Please enter a valid name'
    }
  },
  accountNumber: {
    type: String,
    required: [true, 'Account number is required'],
    unique: true,
    validate: {
      validator: (value) => /^[0-9]{10}$/.test(value),
      message: 'Please enter a valid account number'
    }
  },
  idNumber: {
    type: String,
    required: [true, 'ID number is required'],
    unique: true,
    validate: {
      validator: (value) => /^[0-9]{13}$/.test(value),
      message: 'Please enter a valid ID number'
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: 'Please enter a valid email address'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false
  },
  role: {
    type: String,
    enum: ['customer', 'employee'],
    default: 'customer'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

export const User = mongoose.model('User', userSchema); 