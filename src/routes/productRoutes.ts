import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { body } from 'express-validator';

const router = Router();
const productController = new ProductController();

// Validation middleware
const validateProduct = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a positive number'),
  body('sourceUrl').isURL().withMessage('Source URL must be valid'),
  body('sourceId').notEmpty().withMessage('Source ID is required'),
  body('category').notEmpty().withMessage('Category is required')
];

// Routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/source/:sourceId', productController.getProductsBySource);
router.post('/', validateProduct, productController.createProduct);
router.put('/:id', validateProduct, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router; 