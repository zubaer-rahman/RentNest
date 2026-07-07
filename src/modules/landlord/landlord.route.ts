import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { PropertyValidation } from '../property/property.validation';
import { PropertyController } from '../property/property.controller';
import { RentalValidation } from '../rental/rental.validation';
import { RentalController } from '../rental/rental.controller';
import auth from '../../middlewares/auth';
import { Role } from '../../../generated/prisma';

const router = express.Router();

// All routes here are for LANDLORD role
router.use(auth(Role.LANDLORD));

// Properties
router.post(
  '/properties',
  validateRequest(PropertyValidation.createPropertyValidationSchema),
  PropertyController.createProperty,
);

router.put(
  '/properties/:id',
  validateRequest(PropertyValidation.updatePropertyValidationSchema),
  PropertyController.updateProperty,
);

router.delete('/properties/:id', PropertyController.deleteProperty);

// Rental Requests
// Assignment specifies GET /api/landlord/requests
router.get('/requests', RentalController.getMyRentalRequests);

// Assignment specifies PATCH /api/landlord/requests/:id
router.patch(
  '/requests/:id',
  validateRequest(RentalValidation.updateRentalStatusValidationSchema),
  RentalController.updateRentalRequestStatus,
);

export const LandlordRoutes = router;
