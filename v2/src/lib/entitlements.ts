/**
 * Entitlements — every visitor gets ONE free generation.
 * Unlimited access is a $1.99 one-time purchase via Stripe Checkout.
 *
 * Honest note: generation runs client-side through Cloudinary URLs, so this
 * gate is a product boundary, not a security boundary. At $1.99 that's the
 * right trade-off for simplicity.
 */

const FREE_CREDITS = 1;
const USED_KEY = 'hairrison.generations_used';
const LICENSE_KEY = 'hairrison.license';

export interface License {
  token: string;
  email?: string;
  purchasedAt: string;
}

export function getGenerationsUsed(): number {
  const raw = localStorage.getItem(USED_KEY);
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) ? n : 0;
}

export function recordGeneration(): void {
  localStorage.setItem(USED_KEY, String(getGenerationsUsed() + 1));
}

export function getLicense(): License | null {
  try {
    const raw = localStorage.getItem(LICENSE_KEY);
    return raw ? (JSON.parse(raw) as License) : null;
  } catch {
    return null;
  }
}

export function hasUnlimited(): boolean {
  return getLicense() !== null;
}

export function freeCreditsRemaining(): number {
  return Math.max(0, FREE_CREDITS - getGenerationsUsed());
}

export function canGenerate(): boolean {
  return hasUnlimited() || freeCreditsRemaining() > 0;
}

/** Kick off Stripe Checkout via the serverless endpoint. */
export async function startCheckout(): Promise<void> {
  const res = await fetch('/api/checkout', { method: 'POST' });
  if (!res.ok) {
    throw new Error('Could not start checkout. Payments may not be configured yet.');
  }
  const data = (await res.json()) as { url?: string };
  if (!data.url) throw new Error('Checkout session was created without a redirect URL.');
  window.location.href = data.url;
}

/**
 * After Stripe redirects back with ?session_id=..., verify the payment
 * server-side and store the signed license locally.
 */
export async function verifyAndStoreLicense(sessionId: string): Promise<License | null> {
  const res = await fetch(`/api/verify?session_id=${encodeURIComponent(sessionId)}`);
  if (!res.ok) return null;
  const data = (await res.json()) as { paid: boolean; token?: string; email?: string };
  if (!data.paid || !data.token) return null;
  const license: License = {
    token: data.token,
    email: data.email,
    purchasedAt: new Date().toISOString(),
  };
  localStorage.setItem(LICENSE_KEY, JSON.stringify(license));
  return license;
}

/** Detect a Stripe redirect on load and finalize the license. */
export async function handleCheckoutReturn(): Promise<License | null> {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session_id');
  if (!sessionId) return null;
  const license = await verifyAndStoreLicense(sessionId);
  // Clean the URL either way
  window.history.replaceState({}, '', window.location.pathname);
  return license;
}
