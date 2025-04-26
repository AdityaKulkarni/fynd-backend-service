import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { body } from 'express-validator';

const router = Router();
const authController = new AuthController();

// Validation middleware
const validateRegistration = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('name').notEmpty().withMessage('Name is required')
];

const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);

export default router; 