import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { PropertyValidation } from './property.validation';
import { PropertyController } from './property.controller';
import auth from '../../middlewares/auth';
import { Role } from '../../../generated/prisma';

const router = express.Router();

// Public routes
router.get('/', PropertyController.getAllProperties);
router.get('/:id', PropertyController.getPropertyById);

// Landlord routes
router.post(
  '/',
  auth(Role.LANDLORD),
  validateRequest(PropertyValidation.createPropertyValidationSchema),
  PropertyController.createProperty,
);

router.put(
  '/:id',
  auth(Role.LANDLORD),
  validateRequest(PropertyValidation.updatePropertyValidationSchema),
  PropertyController.updateProperty,
);

router.delete('/:id', auth(Role.LANDLORD), PropertyController.deleteProperty);

export const PropertyRoutes = router;
