import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';
import auth from '../../middlewares/auth';
import { Role } from '../../../generated/prisma';

const router = express.Router();

router.post(
  '/register',
  validateRequest(AuthValidation.registerValidationSchema),
  AuthController.register,
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.login,
);

router.get(
  '/me',
  auth(Role.ADMIN, Role.LANDLORD, Role.TENANT),
  AuthController.getMe,
);

export const AuthRoutes = router;
