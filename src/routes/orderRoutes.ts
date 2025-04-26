import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { body } from 'express-validator';
import { authenticate } from '../middlewares/auth';

const router = Router();
const orderController = new OrderController();

// Validation middleware
const validateOrderStatus = [
  body('status').isIn(['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'])
    .withMessage('Invalid order status')
];

// Routes
router.use(authenticate); // All order routes require authentication

router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id/status', validateOrderStatus, orderController.updateOrderStatus);

export default router; 