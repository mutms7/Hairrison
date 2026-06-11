# Hairrison Studio — AI Hair Try-On, v2 💈

### Built by William Chenyin · originally for Hack Canada 2026

> Try the haircut before the haircut.

🎥 **v1 Demo Video:** [Watch on YouTube](https://youtu.be/vljrvV9sbSA)

Hairrison lets you upload a selfie, pick a hairstyle (or describe your own), and
see an AI-generated preview of the new look before you commit to it in real life.

**v2 ("Hairrison Studio") is a ground-up rebuild** with a new editorial design,
a prompt builder, multi-look comparison, session history, and monetization:
**everyone gets one free look — unlimited looks are a one-time 99¢ unlock.**

The original hackathon build is preserved in [`Hairrison/`](./Hairrison).
The rebuild spec lives in [`BUILD_PROMPT.md`](./BUILD_PROMPT.md).

---

## ✨ What's in v2

| Feature | Detail |
|---|---|
| 🪞 Mirror Compare | Draggable before/after slider framed like an arched salon mirror (keyboard accessible) |
| 🎛 Prompt Builder | Composable chips — length, texture, color, vibe — compiled into a high-quality generative prompt |
| 🖼 Multi-look Compare | Queue up to 3 looks and generate them side by side in one pass |
| 📚 Looks Library | All 27 v1 presets, now searchable and filterable by category and gender |
| 🕘 Session History | Every generated look saved locally in a film-strip rail, one tap to reopen |
| 💳 Monetization | 1 free generation per visitor; $0.99 one-time Stripe Checkout for unlimited |
| ⬇️ Download | Save any result straight to your device |

## 🛠 Tech Stack

- **React 19 + TypeScript + Vite** (`v2/`)
- **Cloudinary** — Upload Widget + Generative Replace (`e_gen_replace` from "hair" to your prompt)
- **Stripe Checkout** — serverless functions in `api/` (Vercel)
- Hand-rolled CSS design system — Bodoni Moda + Outfit, espresso/brass palette

## 🧠 How the AI works

The whole generation engine is one Cloudinary transformation:

```ts
cld.image(publicId)
  .effect(generativeReplace().from('hair').to(prompt))
  .toURL();
```

Cloudinary's generative model segments the hair in the photo and replaces it
with the prompt's description. Commas are stripped from prompts because they
are transformation-step separators in Cloudinary URLs. First render takes
15-60s; after that the URL is cached on Cloudinary's CDN.

## 💵 How payments work

1. Visitor uses their **1 free generation** (tracked in localStorage).
2. Hitting the gate opens the paywall → `POST /api/checkout` creates a Stripe
   Checkout Session (mode: `payment`, $0.99 USD).
3. Stripe redirects back with `?session_id=...` → `GET /api/verify` confirms
   `payment_status === 'paid'` and mints an HMAC-signed license token.
4. The license is stored client-side; the visitor is unlimited from then on.
5. `POST /api/webhook` records `checkout.session.completed` events for an audit trail.

Stripe emails the receipt to the address collected at checkout.
Support / refunds: **chenyinwilliam@gmail.com**

> Honest note: generation runs client-side through Cloudinary URLs, so the
> paywall is a product gate, not a security boundary — a fair trade-off at 99¢.

## 🚀 Getting started

```bash
git clone https://github.com/mutms7/Hairrison.git
cd Hairrison
npm install              # root deps (stripe, for api/)
npm install --prefix v2  # app deps
```

Create `v2/.env`:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
```

Run it:

```bash
npm run dev        # v2 at http://localhost:5173
npm run dev:v1     # original hackathon build
```

### Enabling payments (Vercel)

1. Create a Stripe account → grab your secret key from Developers → API keys.
2. In Vercel project settings, add env vars (see `.env.example`):
   `STRIPE_SECRET_KEY`, `LICENSE_SECRET` (any long random string), `APP_URL`.
3. Optional: add a webhook in Stripe pointing at `https://<your-app>/api/webhook`
   for `checkout.session.completed`, and set `STRIPE_WEBHOOK_SECRET`.
4. Deploy — `vercel.json` builds `v2/` and exposes `api/` automatically.
5. Use Stripe **test mode** (`sk_test_...`, card `4242 4242 4242 4242`) until
   you're ready to flip to live keys.

## 📁 Repo layout

```
├── v2/             # Hairrison Studio (the new app)
├── api/            # Stripe serverless functions (checkout, verify, webhook)
├── Hairrison/      # v1 — original Hack Canada 2026 build (preserved)
├── BUILD_PROMPT.md # the spec the v2 rebuild was executed against
└── vercel.json     # deploys v2 (v1 remains runnable via npm run dev:v1)
```
