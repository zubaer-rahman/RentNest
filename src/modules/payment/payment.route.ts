import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { PaymentValidation } from './payment.validation';
import { PaymentController } from './payment.controller';
import auth from '../../middlewares/auth';
import { Role } from '../../../generated/prisma';

const router = express.Router();

router.post(
  '/create',
  auth(Role.TENANT),
  validateRequest(PaymentValidation.createPaymentValidationSchema),
  PaymentController.createPayment,
);

router.post(
  '/confirm',
  auth(Role.TENANT),
  validateRequest(PaymentValidation.confirmPaymentValidationSchema),
  PaymentController.confirmPayment,
);

router.get('/', auth(Role.TENANT), PaymentController.getMyPayments);

router.get('/:id', auth(Role.TENANT), PaymentController.getPaymentById);

export const PaymentRoutes = router;
