import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { RentalValidation } from './rental.validation';
import { RentalController } from './rental.controller';
import auth from '../../middlewares/auth';
import { Role } from '../../../generated/prisma';

const router = express.Router();

// Tenant routes
router.post(
  '/',
  auth(Role.TENANT),
  validateRequest(RentalValidation.createRentalRequestValidationSchema),
  RentalController.createRentalRequest,
);

// Shared: tenant sees their own, landlord sees requests for their properties
// NOTE: Landlord's /api/landlord/requests is handled in landlord.route.ts
router.get(
  '/',
  auth(Role.TENANT),
  RentalController.getMyRentalRequests,
);

router.get(
  '/:id',
  auth(Role.TENANT),
  RentalController.getRentalRequestById,
);

export const RentalRoutes = router;
