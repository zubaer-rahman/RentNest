import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PaymentService } from './payment.service';

const createPayment = catchAsync(async (req, res) => {
  const result = await PaymentService.createPayment(req.user.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Payment initiated successfully',
    data: result,
  });
});

const confirmPayment = catchAsync(async (req, res) => {
  const result = await PaymentService.confirmPayment(req.user.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment confirmed successfully',
    data: result,
  });
});

const getMyPayments = catchAsync(async (req, res) => {
  const result = await PaymentService.getMyPayments(req.user.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment history retrieved successfully',
    data: result,
  });
});

const getPaymentById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PaymentService.getPaymentById(id as string, req.user.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment details retrieved successfully',
    data: result,
  });
});

const stripeWebhook = catchAsync(async (req, res) => {
  const stripe = require('stripe')(require('../../config').default.stripe_secret_key);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      require('../../config').default.stripe_webhook_secret
    );
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    // Here you would typically call a service method to update the payment status
    // For example: await PaymentService.confirmStripePayment(paymentIntent.id);
  }

  res.json({ received: true });
});

export const PaymentController = {
  createPayment,
  confirmPayment,
  getMyPayments,
  getPaymentById,
  stripeWebhook,
};
