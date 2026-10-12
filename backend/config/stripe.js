import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey || stripeSecretKey.includes('your_stripe_secret_key_here')) {
  console.warn('⚠️ [Stripe Config Warning]: STRIPE_SECRET_KEY is missing or set to a placeholder in .env. Please configure a valid Stripe test key (sk_test_...) to process online payments.');
}

/**
 * Initialize Stripe SDK instance
 * Uses fallback dummy key to prevent server crash during startup if STRIPE_SECRET_KEY is empty
 */
const stripe = new Stripe(stripeSecretKey && !stripeSecretKey.includes('your_stripe_secret_key_here') ? stripeSecretKey : 'sk_test_placeholder_key');

export default stripe;
