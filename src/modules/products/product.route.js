import { Router } from 'express';
import ProductController from './product.controller.js';
import { validate } from '../../middleware/validate.js';
import { createProductSchema } from './product.validation.js';
import { checkPermission } from '../../middleware/auth.middleware.js'

const router = Router();

// Create product route
router.post('/products/create-product', checkPermission("product:create"), validate(createProductSchema), ProductController.createProduct);

// Get all products (Paginated with search)
router.get('/products/get-all-products', ProductController.getAllProducts);

// Get single product detail by ID
router.get('/products/:id/get-product-detail', ProductController.getProductById);

export default router;
