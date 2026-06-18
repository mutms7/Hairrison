# Hairrison Studio 💈

> **Try the haircut before the haircut.**

AI hairstyle preview, rebuilt as a real product. Upload a selfie, describe any look you can dream up, and see yourself in it (in a salon mirror) before you commit.

🌐 **Live app:** [hairrison.vercel.app](https://hairrison.vercel.app/)
🎥 **v1 Demo Video:** [Watch on YouTube](https://youtu.be/vljrvV9sbSA)
🏆 Originally built by William Chenyin for Hack Canada 2026. This repo now contains **v2 ("Hairrison Studio")**, a ground-up rebuild. The original hackathon app is preserved in [`Hairrison/`](./Hairrison).

---

## What it does

1. **Upload a selfie** via the Cloudinary Upload Widget. It stays in your Cloudinary library.
2. **Build your own look** (the main event): type anything, "shaggy mullet with micro bangs," "platinum buzz cut," even "a rat on my head," or assemble a look from length / texture / color chips. The prompt is sent to Cloudinary nearly verbatim, so what you describe is what you get. It isn't restricted to hair.
3. **Or get inspired** from the preset gallery: real reference photos for **Women** and **Men**, filterable by **length** (short / medium / long) and **texture** (straight / wavy / curly). Hover any look and tap **Try this look** to render it onto your photo.
4. **Mirror Compare**: drag the salon-mirror slider to sweep between before and after.
5. **Switch between generated looks** via result tabs, and **download** any one.
6. **Session history**: every look you make is saved locally and restorable from the film-strip rail.

## Pricing

Two **free tries** to start, no account, no card: one **custom-prompt look** and one **preset look**, so you can feel both halves of the product. After that, unlimited looks are a **one-time $1.99 unlock** via Stripe Checkout. No subscription, ever. Stripe emails your receipt at checkout; support: chenyinwilliam@gmail.com.

### Dev mode 🔑

Type the secret word **`harey`** anywhere on the page (or right into the prompt box) to flip on **dev mode**: unlimited generations on that device, no payment. It's a convenience for the owner and anyone they share the word with, the gate is client-side anyway (see the honest limitation below).

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

**Core engine** (Cloudinary Generative Replace). Prompts are kept short and literal, no appended boilerplate, since long comma-heavy prompts muddy the result:

```ts
cld.image(publicId)
  .effect(generativeReplace().from('hair').to(prompt))  // commas/slashes → spaces, whitespace collapsed
  .toURL();
```

**Entitlements**: two free credits (one `prompt`, one `preset`), the dev-mode flag, and the license all live in `localStorage`. Licenses are HMAC-signed server-side (`LICENSE_SECRET`) and verified after Stripe redirects back with `session_id`.

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

Deploy: `vercel` runs the root `vercel.json`, which builds `v2/` and exposes `api/`.

---

## Tech stack

React 19 · TypeScript · Vite · Cloudinary Upload Widget + URL Gen SDK + Generative Replace · Stripe Checkout · Vercel Serverless

## Design

Backstage-editorial: espresso surfaces, brass rules, porcelain type, Bodoni Moda display over Outfit UI. The custom prompt builder leads; the preset gallery (reference photos via Unsplash) is framed as inspiration, not the main path. One bold element (the mirror slider); everything else stays quiet.
