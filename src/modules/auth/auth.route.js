import { Router } from 'express';
import AuthController from './auth.controller.js';
import { validate } from '../../middleware/validate.js';
import { loginSchema } from './auth.validation.js';

const router = Router();

router.post('/auth/login', validate(loginSchema), AuthController.login);

export default router;
