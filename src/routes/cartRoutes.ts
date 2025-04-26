import { Router } from 'express';
import { CartController } from '../controllers/CartController';
import { body } from 'express-validator';
import { authenticate } from '../middlewares/auth';

const router = Router();
const cartController = new CartController();

// Validation middleware
const validateCartItem = [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('price').isNumeric().withMessage('Price must be a number')
];

// Routes
router.use(authenticate); // All cart routes require authentication

router.get('/', cartController.getCart);
router.post('/items', validateCartItem, cartController.addItemToCart);
router.put('/items/:itemId', 
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  cartController.updateCartItem
);
router.delete('/items/:itemId', cartController.removeItemFromCart);
router.put('/items/:itemId/select', cartController.toggleItemSelection);
router.delete('/', cartController.clearCart);

export default router; 