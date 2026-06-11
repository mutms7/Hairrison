# Hairrison Studio 💈

> **Try the haircut before the haircut.**

AI hairstyle preview, rebuilt as a real product. Upload a selfie, compose a look, and see yourself in it — in a salon mirror — before you commit.

🎥 **v1 Demo Video:** [Watch on YouTube](https://youtu.be/vljrvV9sbSA)
🏆 Originally built by William Chenyin for Hack Canada 2026. This repo now contains **v2 ("Hairrison Studio")**, a ground-up rebuild — the original hackathon app is preserved in [`Hairrison/`](./Hairrison).

---

## What it does

1. **Upload a selfie** via the Cloudinary Upload Widget
2. **Compose a look** — pick from 27 curated presets, build a prompt from chips (length / texture / color / vibe), or write your own
3. **Generate** — Cloudinary Generative Replace swaps your hair for the described style
4. **Mirror Compare** — drag the salon-mirror slider to sweep between before and after
5. **Queue up to 3 looks** and compare them side by side
6. **Download** the result, or restore any look from your session history

## Pricing

Your **first generation is free** — no account, no card. Unlimited looks are a **one-time $1.99 unlock** via Stripe Checkout. No subscription, ever. Stripe emails your receipt at checkout; support: chenyinwilliam@gmail.com.

---

## Architecture

```
├── v2/          Vite + React 19 + TypeScript (the app)
├── api/         Vercel serverless functions (Stripe)
│   ├── checkout.js   POST  → creates $1.99 Checkout Session
│   ├── verify.js     GET   → verifies payment, mints HMAC-signed license
│   └── webhook.js    POST  → records checkout.session.completed
└── Hairrison/   v1 (Hack Canada 2026 original, preserved)
```

**Core engine** — Cloudinary Generative Replace:

```ts
cld.image(publicId)
  .effect(generativeReplace().from('hair').to(prompt))  // commas stripped first
  .toURL();
```

**Entitlements** — free credit + license live in `localStorage`; licenses are HMAC-signed server-side (`LICENSE_SECRET`) and verified after Stripe redirects back with `session_id`.

> **Honest limitation:** generation runs client-side through Cloudinary URLs, so the paywall is a product gate, not a security boundary. At $1.99 that's the right trade-off.

---

## Setup

### 1. Cloudinary
- Create a free account → note your **cloud name**
- Create an **unsigned upload preset** (Settings → Upload)
- Generative Replace requires a plan with generative AI add-ons enabled

### 2. Stripe
- Grab your secret key (`sk_test_...` to start)
- Add a webhook endpoint → `https://<your-app>/api/webhook`, event `checkout.session.completed` → note the `whsec_...` secret

### 3. Environment

Copy `.env.example`. For local dev, put the `VITE_*` vars in `v2/.env`; set everything in Vercel project env vars for deployment:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
LICENSE_SECRET=any-long-random-string
APP_URL=https://your-deployment.vercel.app
```

### 4. Run

```bash
npm install && npm install --prefix v2
npm --prefix v2 run dev        # app on :5173
vercel dev                     # or run app + api together
```

Deploy: `vercel` — the root `vercel.json` builds `v2/` and exposes `api/`.

---

## Tech stack

React 19 · TypeScript · Vite · Cloudinary Upload Widget + URL Gen SDK + Generative Replace · Stripe Checkout · Vercel Serverless

## Design

Backstage-editorial: espresso surfaces, brass rules, porcelain type — Bodoni Moda display over Outfit UI. One bold element (the mirror slider); everything else stays quiet.
