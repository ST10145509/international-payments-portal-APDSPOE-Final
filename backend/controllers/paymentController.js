import { Transaction } from '../models/Transaction.js';

export const paymentController = {
  async createPayment(req, res) {
    try {
      console.log('Received payment request:', req.body);
      const { amount, currency, recipientDetails } = req.body;

      const transaction = await Transaction.create({
        amount,
        currency,
        recipientDetails,
        customerId: req.user._id,
        status: 'pending'
      });

      res.json(transaction);
    } catch (error) {
      console.error('Payment creation error:', error);
      res.status(400).json({ message: error.message });
    }
  },

  async getCustomerTransactions(req, res) {
    try {
      const transactions = await Transaction.find({ 
        customerId: req.user._id 
      }).sort('-createdAt');

      res.json(transactions);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async getPendingTransactions(req, res) {
    try {
      const transactions = await Transaction.find({ 
        status: 'pending' 
      })
      .populate({
        path: 'customerId',
        select: 'fullName accountNumber email'
      })
      .populate({
        path: 'verificationDetails.verifiedBy',
        select: 'fullName'
      })
      .sort('-createdAt');

      if (!transactions) {
        return res.status(404).json({ message: 'No pending transactions found' });
      }

      console.log('Pending transactions retrieved:', transactions.length);
      res.json(transactions);
    } catch (error) {
      console.error('Error getting pending transactions:', error);
      res.status(400).json({ message: error.message });
    }
  },

  async verifyTransaction(req, res) {
    try {
      const { transactionId } = req.params;
      const { isValid, notes } = req.body;

      const transaction = await Transaction.findById(transactionId);

      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      transaction.status = isValid ? 'verified' : 'rejected';
      transaction.verificationDetails = {
        verifiedBy: req.user._id,
        verifiedAt: new Date(),
        notes
      };

      await transaction.save();
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async submitToSwift(req, res) {
    try {
      const { transactions } = req.body;

      await Transaction.updateMany(
        {
          _id: { $in: transactions },
          status: 'verified'
        },
        {
          $set: {
            status: 'completed'
          }
        }
      );

      res.json({ 
        success: true, 
        message: 'Transactions submitted to SWIFT successfully' 
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async getVerifiedTransactions(req, res) {
    try {
      const transactions = await Transaction.find({ 
        status: 'verified' 
      })
      .populate({
        path: 'customerId',
        select: 'fullName accountNumber email'
      })
      .populate({
        path: 'verificationDetails.verifiedBy',
        select: 'fullName'
      })
      .sort('-createdAt');

      res.json(transactions);
    } catch (error) {
      console.error('Error getting verified transactions:', error);
      res.status(400).json({ message: error.message });
    }
  }
}; 