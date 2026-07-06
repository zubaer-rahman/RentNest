import { z } from 'zod';

const createPaymentValidationSchema = z.object({
  body: z.object({
    rentalRequestId: z.string({ message: 'Rental request ID is required' }),
    provider: z.enum(['STRIPE', 'SSLCOMMERZ'], {
      message: 'Provider must be STRIPE or SSLCOMMERZ',
    }),
  }),
});

const confirmPaymentValidationSchema = z.object({
  body: z.object({
    transactionId: z.string({ message: 'Transaction ID is required' }),
  }),
});

export const PaymentValidation = {
  createPaymentValidationSchema,
  confirmPaymentValidationSchema,
};
