import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    enum: ['USD', 'EUR', 'GBP', 'ZAR']
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'completed', 'rejected'],
    default: 'pending'
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipientDetails: {
    name: {
      type: String,
      required: true,
      validate: {
        validator: (value) => /^[a-zA-Z ]{2,50}$/.test(value),
        message: 'Please enter a valid recipient name'
      }
    },
    account: {
      type: String,
      required: true,
      validate: {
        validator: (value) => /^[0-9]{8,20}$/.test(value),
        message: 'Please enter a valid account number'
      }
    },
    swiftCode: {
      type: String,
      required: true,
      validate: {
        validator: (value) => /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
        message: 'Please enter a valid SWIFT code'
      }
    },
    bank: String
  },
  verificationDetails: {
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: Date,
    notes: String
  }
}, {
  timestamps: true
});

export const Transaction = mongoose.model('Transaction', transactionSchema); 