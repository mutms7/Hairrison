/**
 * GET /api/verify?session_id=cs_...
 * Confirms the Checkout Session was paid and mints an HMAC-signed license token.
 *
 * Env required:
 *   STRIPE_SECRET_KEY
 *   LICENSE_SECRET: any long random string (used to sign license tokens)
 */
import Stripe from 'stripe';
import crypto from 'node:crypto';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { session_id: sessionId } = req.query;
  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({ error: 'session_id is required' });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return res.status(503).json({ error: 'Payments are not configured.' });
  }

  const stripe = new Stripe(secretKey);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === 'paid';

    if (!paid) {
      return res.status(200).json({ paid: false });
    }

    const licenseSecret = process.env.LICENSE_SECRET || secretKey;
    const payload = JSON.stringify({
      sid: session.id,
      product: 'hairrison-unlimited-v2',
      iat: Date.now(),
    });
    const signature = crypto
      .createHmac('sha256', licenseSecret)
      .update(payload)
      .digest('hex');
    const token = Buffer.from(payload).toString('base64url') + '.' + signature;

    return res.status(200).json({
      paid: true,
      token,
      email: session.customer_details?.email || undefined,
    });
  } catch (err) {
    console.error('Stripe verify error:', err);
    return res.status(500).json({ error: 'Could not verify payment.' });
  }
}
