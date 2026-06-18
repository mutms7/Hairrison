/**
 * Entitlements.
 *
 * Every new visitor gets TWO free tries so they can actually feel the
 * product: one free custom-prompt look, and one free preset look. After
 * that, unlimited access is a $1.99 one-time purchase via Stripe.
 *
 * There's also a hidden "dev mode": type the secret word anywhere and
 * generation becomes unlimited on this device. It's for the owner (and
 * anyone they hand the word to) to test freely. Not a security boundary,
 * just a convenience, the whole gate is client-side anyway.
 *
 * Honest note: generation runs client-side through Cloudinary URLs, so
 * this gate is a product boundary, not a security boundary. At $1.99
 * that's the right trade-off for simplicity.
 */

const PROMPT_USED_KEY = 'hairrison.free_prompt_used';
const PRESET_USED_KEY = 'hairrison.free_preset_used';
const LICENSE_KEY = 'hairrison.license';
const DEV_KEY = 'hairrison.dev_mode';

/** Type this anywhere (or in the prompt box) to unlock dev mode. */
export const DEV_CODE = 'harey';

export type LookKind = 'prompt' | 'preset';

export interface License {
  token: string;
  email?: string;
  purchasedAt: string;
}

// ── Dev mode ─────────────────────────────────────────────────
export function isDevMode(): boolean {
  return localStorage.getItem(DEV_KEY) === '1';
}

export function setDevMode(on: boolean): void {
  if (on) localStorage.setItem(DEV_KEY, '1');
  else localStorage.removeItem(DEV_KEY);
}

/**
 * Watch for the secret word being typed anywhere on the page. Returns
 * an unsubscribe function. Fires `onUnlock` the first time it's matched.
 */
export function watchForDevCode(onUnlock: () => void): () => void {
  let buffer = '';
  const handler = (e: KeyboardEvent) => {
    if (e.key.length !== 1) return; // ignore Shift, Enter, etc.
    buffer = (buffer + e.key.toLowerCase()).slice(-DEV_CODE.length);
    if (buffer === DEV_CODE) {
      setDevMode(true);
      onUnlock();
    }
  };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}

// ── License (paid unlimited) ─────────────────────────────────
export function getLicense(): License | null {
  try {
    const raw = localStorage.getItem(LICENSE_KEY);
    return raw ? (JSON.parse(raw) as License) : null;
  } catch {
    return null;
  }
}

export function hasPaid(): boolean {
  return getLicense() !== null;
}

/** Unlimited from any source: paid license or dev mode. */
export function hasUnlimited(): boolean {
  return hasPaid() || isDevMode();
}

// ── Free tries (one prompt + one preset) ─────────────────────
function used(key: string): boolean {
  return localStorage.getItem(key) === '1';
}

export function freePromptRemaining(): number {
  return used(PROMPT_USED_KEY) ? 0 : 1;
}

export function freePresetRemaining(): number {
  return used(PRESET_USED_KEY) ? 0 : 1;
}

export function freeCreditsRemaining(): number {
  return freePromptRemaining() + freePresetRemaining();
}

/** Can the user generate a look of this kind right now? */
export function canGenerate(kind: LookKind): boolean {
  if (hasUnlimited()) return true;
  return kind === 'prompt' ? freePromptRemaining() > 0 : freePresetRemaining() > 0;
}

/** Spend a free try for this look kind (no-op if unlimited). */
export function recordGeneration(kind: LookKind): void {
  if (hasUnlimited()) return;
  localStorage.setItem(kind === 'prompt' ? PROMPT_USED_KEY : PRESET_USED_KEY, '1');
}

// ── Stripe checkout ──────────────────────────────────────────
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
