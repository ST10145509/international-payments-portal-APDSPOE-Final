import express from 'express';
import { paymentController } from '../controllers/paymentController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/inputValidator.js';
import Joi from 'joi';

const router = express.Router();

const paymentSchema = Joi.object({
  amount: Joi.number().min(0.01).required(),
  currency: Joi.string().valid('USD', 'EUR', 'GBP', 'ZAR').required(),
  recipientDetails: Joi.object({
    name: Joi.string().pattern(/^[a-zA-Z ]{2,50}$/).required(),
    account: Joi.string().pattern(/^[0-9]{8,20}$/).required(),
    swiftCode: Joi.string().pattern(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/).required(),
    bank: Joi.string().required()
  }).required()
});

router.use(protect); // Protect all routes

// Customer routes
router.post('/create', 
  restrictTo('customer'), 
  validateRequest(paymentSchema), 
  paymentController.createPayment
);
router.get('/customer-transactions', 
  restrictTo('customer'), 
  paymentController.getCustomerTransactions
);

// Employee routes
router.get('/pending', 
  restrictTo('employee'), 
  paymentController.getPendingTransactions
);
router.post('/verify/:transactionId', 
  restrictTo('employee'), 
  paymentController.verifyTransaction
);
router.post('/submit-swift', 
  restrictTo('employee'), 
  paymentController.submitToSwift
);
router.get('/verified', 
  restrictTo('employee'), 
  paymentController.getVerifiedTransactions
);

export default router; 