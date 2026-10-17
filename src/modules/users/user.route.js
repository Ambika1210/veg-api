import { Router } from 'express';
import UserController from './user.controller.js';
import { validate } from '../../middleware/validate.js';
import { createUserSchema, updateUserSchema } from './user.validation.js';
import { checkPermission } from '../../middleware/auth.middleware.js'

const router = Router();

// Customer registration route
router.post('/users/create-customer', validate(createUserSchema), UserController.createCustomer);

// Admin registration route
router.post('/users/create-admin', checkPermission("admin:create"), validate(createUserSchema), UserController.createAdmin);

// Get all users (Paginated, search, role filters)
router.get('/user/get-all-users', UserController.getAllUsers);

// Get user by id
router.get('/users/:id/get-user-detail', UserController.getUserById);

// Update user by id
router.patch('/users/:id/update-user', validate(updateUserSchema), UserController.updateUser);

// Delete user by id
router.delete('/users/:id/delete-user', UserController.deleteUser);

export default router;
