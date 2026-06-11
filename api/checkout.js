/**
 * POST /api/checkout
 * Creates a Stripe Checkout Session for the one-time $0.99 unlimited unlock.
 *
 * Env required:
 *   STRIPE_SECRET_KEY  — sk_live_... or sk_test_...
 *   APP_URL            — e.g. https://hairrison.vercel.app (no trailing slash)
 */
import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return res.status(503).json({
      error: 'Payments are not configured. Set STRIPE_SECRET_KEY in the environment.',
    });
  }

  const appUrl = process.env.APP_URL || `https://${req.headers.host}`;
  const stripe = new Stripe(secretKey);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: 99, // $0.99 one-time
            product_data: {
              name: 'Hairrison Studio — Unlimited Looks',
              description:
                'One-time unlock. Generate unlimited AI hairstyle previews, forever.',
            },
          },
          quantity: 1,
        },
      ],
      // Stripe collects the customer's email at checkout and sends the receipt there.
      success_url: `${appUrl}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/?checkout=cancelled`,
      metadata: { product: 'hairrison-unlimited-v2' },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return res.status(500).json({ error: 'Could not create checkout session.' });
  }
}
