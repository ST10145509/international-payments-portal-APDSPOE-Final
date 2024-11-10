import express from 'express';
import { authController } from '../controllers/authController.js';
import { validateRequest } from '../middleware/inputValidator.js';
import Joi from 'joi';

const router = express.Router();

const registerSchema = Joi.object({
  fullName: Joi.string().pattern(/^[a-zA-Z ]{2,50}$/).required(),
  idNumber: Joi.string().pattern(/^[0-9]{13}$/).required(),
  accountNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});

const loginSchema = Joi.object({
  accountNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
  password: Joi.string().required()
});

router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);

export default router; 