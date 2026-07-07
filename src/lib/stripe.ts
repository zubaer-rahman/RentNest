import Stripe from 'stripe';
import config from '../config';

const stripe = new Stripe(config.stripe_secret_key as string, {
  apiVersion: '2026-06-24.dahlia' as any,
});

export default stripe;
