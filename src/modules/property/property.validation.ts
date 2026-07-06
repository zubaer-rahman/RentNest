import { z } from 'zod';

const createPropertyValidationSchema = z.object({
  body: z.object({
    categoryId: z.string({ message: 'Category ID is required' }),
    title: z.string({ message: 'Title is required' }),
    description: z.string({ message: 'Description is required' }),
    address: z.string({ message: 'Address is required' }),
    city: z.string({ message: 'City is required' }),
    rent: z.number({ message: 'Rent is required' }).positive(),
    bedrooms: z.number({ message: 'Bedrooms count is required' }).int().nonnegative(),
    bathrooms: z.number({ message: 'Bathrooms count is required' }).int().nonnegative(),
    area: z.number({ message: 'Area is required' }).positive(),
  }),
});

const updatePropertyValidationSchema = z.object({
  body: z.object({
    categoryId: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    rent: z.number().positive().optional(),
    bedrooms: z.number().int().nonnegative().optional(),
    bathrooms: z.number().int().nonnegative().optional(),
    area: z.number().positive().optional(),
    isAvailable: z.boolean().optional(),
  }),
});

export const PropertyValidation = {
  createPropertyValidationSchema,
  updatePropertyValidationSchema,
};
