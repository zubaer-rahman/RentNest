import { v4 as uuidv4 } from 'uuid';
import httpStatus from 'http-status';
import AppError from '../../utils/AppError';
import prisma from '../../utils/prisma';
import { PaymentStatus, RequestStatus } from '../../../generated/prisma';

const createPayment = async (
  tenantId: string,
  payload: { rentalRequestId: string; provider: string },
) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: payload.rentalRequestId },
    include: { property: true },
  });

  if (!rentalRequest) {
    throw new AppError(httpStatus.NOT_FOUND, 'Rental request not found');
  }

  if (rentalRequest.tenantId !== tenantId) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to pay for this request');
  }

  if (rentalRequest.status !== RequestStatus.APPROVED) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Payment can only be made for approved rental requests');
  }

  // Check if payment already exists
  const existingPayment = await prisma.payment.findFirst({
    where: {
      rentalRequestId: payload.rentalRequestId,
      status: PaymentStatus.COMPLETED,
    },
  });

  if (existingPayment) {
    throw new AppError(httpStatus.CONFLICT, 'Payment has already been completed for this request');
  }

  // Create a pending payment record
  // In a real implementation, this is where you'd call Stripe/SSLCommerz API
  const payment = await prisma.payment.create({
    data: {
      transactionId: uuidv4(), // Placeholder until gateway returns one
      rentalRequestId: payload.rentalRequestId,
      amount: rentalRequest.property.rent,
      method: 'ONLINE',
      provider: payload.provider,
      status: PaymentStatus.PENDING,
    },
  });

  return {
    paymentId: payment.id,
    amount: payment.amount,
    provider: payment.provider,
    status: payment.status,
    message: `Proceed to complete payment via ${payload.provider}`,
  };
};

const confirmPayment = async (tenantId: string, payload: { transactionId: string }) => {
  const payment = await prisma.payment.findUnique({
    where: { transactionId: payload.transactionId },
    include: { rentalRequest: true },
  });

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Payment record not found');
  }

  if (payment.rentalRequest.tenantId !== tenantId) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to confirm this payment');
  }

  const updatedPayment = await prisma.payment.update({
    where: { transactionId: payload.transactionId },
    data: {
      status: PaymentStatus.COMPLETED,
      paidAt: new Date(),
    },
  });

  // Update rental request status to ACTIVE after payment
  await prisma.rentalRequest.update({
    where: { id: payment.rentalRequestId },
    data: { status: RequestStatus.APPROVED }, // stays APPROVED; can add ACTIVE if enum is extended
  });

  return updatedPayment;
};

const getMyPayments = async (userId: string) => {
  const result = await prisma.payment.findMany({
    where: {
      rentalRequest: {
        tenantId: userId,
      },
    },
    include: {
      rentalRequest: {
        include: { property: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return result;
};

const getPaymentById = async (id: string, userId: string) => {
  const result = await prisma.payment.findUnique({
    where: { id },
    include: {
      rentalRequest: {
        include: { property: true },
      },
    },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Payment not found');
  }

  if (result.rentalRequest.tenantId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'You do not have access to this payment');
  }

  return result;
};

export const PaymentService = {
  createPayment,
  confirmPayment,
  getMyPayments,
  getPaymentById,
};
