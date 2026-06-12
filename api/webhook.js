/**
 * POST /api/webhook
 * Stripe webhook: records completed checkouts. Optional but recommended:
 * gives you a server-side audit trail of every purchase even if the buyer
 * never returns to the success URL.
 *
 * Env required:
 *   STRIPE_SECRET_KEY
 *   STRIPE_WEBHOOK_SECRET: whsec_... from the Stripe dashboard webhook config
 */
import Stripe from 'stripe';

export const config = {
  api: { bodyParser: false }, // Stripe needs the raw body to verify signatures
};

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) {
    return res.status(503).json({ error: 'Webhook is not configured.' });
  }

  const stripe = new Stripe(secretKey);

  let event;
  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(
      rawBody,
      req.headers['stripe-signature'],
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('Hairrison purchase completed:', {
      sessionId: session.id,
      email: session.customer_details?.email,
      amount: session.amount_total,
      currency: session.currency,
    });
    // Extension point: persist to a database, send a welcome email, etc.
  }

  return res.status(200).json({ received: true });
}
