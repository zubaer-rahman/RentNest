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

// Landlord routes are now handled in landlord.route.ts


export const PropertyRoutes = router;
