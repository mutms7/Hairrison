# 🌊 Hairrison — AI Hair Try-On

> *Imagine your next hairstyle before you commit.*

Hairrison is an AI-powered hair visualiser that lets you upload a selfie and see yourself with any hairstyle — in seconds. Built with Cloudinary's Generative Replace API, it replaces detected hair with whatever style you describe or choose, making it the perfect tool for anyone curious about a new look.

---

## 🏄 What It Does

- **Upload** a photo of yourself
- **Choose** from 26+ curated hairstyle presets (Women's, Men's & Unisex) — or type your own custom description
- **✦ Imagine** — Cloudinary's Generative AI swaps your hair in ~15 seconds
- **Compare** before & after side by side
- **Download** your new look

No appointment. No commitment. Just vibes.

---

## 🎯 Inspiration

We've all stood in front of a mirror imagining what we'd look like with a different hairstyle. Booking a haircut is scary — what if it doesn't suit you? Hairrison solves that.

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19 + TypeScript |
| Build Tool | Vite 6 |
| Styling | Pure CSS (custom design system, no UI library) |
| AI Transformation | **Cloudinary Generative Replace** (`e_gen_replace`) |
| Image Delivery | Cloudinary URL-gen SDK (`@cloudinary/url-gen`) |
| Upload | Cloudinary Upload Widget |
| Fonts | Playfair Display + Cormorant Garamond (Google Fonts) |

### Libraries Used
- `@cloudinary/react` ^1.14.3
- `@cloudinary/url-gen` ^1.22.0
- `react` ^19.2.0
- `vite` ^6.0.0
- `typescript` ~5.9.3

---

## ⚡ How It Works

Cloudinary's `e_gen_replace:from_hair;to_{style}` transformation uses generative AI to detect hair in an image and replace it with a described style. We pass a natural-language prompt (e.g. `"wolf cut with curtain bangs heavy layers lots of volume"`) as the `to_` parameter.

The URL-gen SDK constructs the transformation URL:
```ts
cld.image(publicId)
  .effect(generativeReplace().from('hair').to(hairstylePrompt))
  .toURL()
```

---

## 🚀 Getting Started

```bash
git clone https://github.com/YOUR_USERNAME/hairrison
cd hairrison
npm install
```

Create a `.env` file:
```
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

> **Note:** You'll need a Cloudinary account with the **Generative Replace** add-on enabled (free tier available at console.cloudinary.com → Add-ons).

```bash
npm run dev
```

---

## 🎨 Features

- **26+ hairstyles** — Women's, Men's & Unisex categories
- **Preset grid** with one-click style selection
- **Custom descriptions** — describe any style in natural language
- **I'm Feeling Lucky** — random style picker
- **Marketplace** — browse trending styles with category & gender filters
- **Before/After compare** — side-by-side view after transformation
- **Download** your result
- **Beach-themed UI** — aquamarine & ocean blue design system

---

## 🌊 Sponsor Technologies

- **Cloudinary** — Core AI transformation engine (`e_gen_replace`), image upload, delivery & optimisation

---

## 👥 Team

Built for Hack Canada 2026 · March 2026

---

*Made with 🌊 and Cloudinary*
