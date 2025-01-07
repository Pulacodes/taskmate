import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { taskid } = req.query;
  const { offerId, amount } = req.body;

  if (!taskid || !offerId || !amount) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Task Assignment for Task ID: ${taskid}`,
              description: `Payment for assigning task to ${offerId}`,
            },
            unit_amount: Math.round(amount * 100), // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/tasks/${taskid}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/tasks/${taskid}?canceled=true`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create payment session' });
  }
}
