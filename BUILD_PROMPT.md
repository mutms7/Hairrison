# Build Prompt — Hairrison 2.0 ("Hairrison Studio")

> This is the spec Claude wrote for itself before rebuilding Hairrison from scratch.

## Mission

Rebuild Hairrison as a polished, monetizable product. Keep the soul — "try the
haircut before the haircut" — but ship it like a real app, not a hack-weekend demo.

## Core engine (carried forward from v1)

- Cloudinary **Generative Replace**: `effect(generativeReplace().from('hair').to(prompt))`
- Unsigned Upload Widget (script in index.html, poll-until-ready init, 10s timeout)
- Commas stripped from prompts (Cloudinary transformation separator)
- `f_auto,q_auto` optimized delivery URLs

## What v2 adds

1. **Prompt Builder** — composable chips (length / texture / color / vibe) that
   compile into a high-quality generative prompt, plus free-text mode.
2. **Mirror Compare** — draggable before/after slider, framed like a salon mirror.
   This is the signature UI element.
3. **Multi-look Compare** — queue up to 3 looks and generate them side by side.
4. **Session History** — every generated look saved locally, one tap to restore.
5. **Monetization** — first generation is free for everyone. Unlimited access is
   a **$1.99 one-time payment** via Stripe Checkout:
   - `api/checkout.ts` → creates a Checkout Session (mode: payment, $1.99 CAD/USD)
   - `api/verify.ts` → verifies the paid session, mints an HMAC-signed license
   - `api/webhook.ts` → records `checkout.session.completed` events
   - License stored client-side; free credit tracked in localStorage
   - Support / fallback receipt email: chenyinwilliam@gmail.com
6. **Download & share** the result image.

## Design direction

Not the default dark-page-with-acid-accent and not the cream-and-terracotta
template. Subject is a salon: go **backstage editorial** — deep espresso surfaces,
brass/copper accent, porcelain text, a film-strip rail of looks. Type: Bodoni Moda
(display, high-contrast fashion-masthead energy) + Outfit (body/UI). One bold
element (the mirror slider), everything else quiet and disciplined. Zero-radius
frames with thin brass rules; salon-mirror framing on imagery.

## Architecture

- `v2/` — fresh Vite + React 19 + TypeScript app (no UI framework, hand-rolled CSS)
- `api/` — Vercel serverless functions (Node 20, `stripe` SDK)
- Root `vercel.json` builds `v2/` and exposes `api/`
- Env: `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`,
  `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `LICENSE_SECRET`, `APP_URL`

## Honest limitations (documented, not hidden)

- Generation happens client-side via Cloudinary URLs, so the paywall is a product
  gate, not a security boundary. Acceptable at $1.99; noted in README.
- Free-credit tracking is per-browser (localStorage).

## Definition of done

- `npm run build` passes clean in `v2/`
- All v1 presets ported and expanded
- README rewritten for v2 with full setup (Cloudinary + Stripe)
- Committed to the repo with v1 preserved under `Hairrison/`
