import {stripe} from '../../../lib/utils';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const stripe = require('stripe')('sk_test_51QLBjcHp71LkDwhWWq5HlBe0PN9btQFiQJVEw3Sdfzan5lc12k5Rm5NlgcqhlIponREXabkoxcmZFth9jVAzgoKQ00dXY29ErY');

const account = await stripe.accounts.create({
  country: 'US',
  email: 'admin@taskmate.com',
  controller: {
    fees: {
      payer: 'application',
    },
    losses: {
      payments: 'application',
    },
    stripe_dashboard: {
      type: 'express',
    },
  },
});

      res.json({account: account.id});
    } catch (error) {
      console.error('An error occurred when calling the Stripe API to create an account:', error);
      res.status(500);
      res.json({error: error.message});
    }
  }
}