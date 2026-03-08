# Hairrison — AI Hair Try-On 💇‍♀️
### Built by William Chenyin for Hack Canada 2026

> Try the haircut before the haircut.

Hairrison is an AI-powered hairstyle preview app that helps users see different hairstyles on their own photo before making a real change.

Built around the idea of **hair comparison**, the app makes hairstyle exploration fast, low-pressure, and fun.

---

## 🚨 The Problem

Changing your hair is high-stakes. Most people are forced to guess how a new style might look using imagination, reference photos, and hope.

Hairrison helps close the gap between **“maybe this would look good on me”** and **actually seeing it first**.

---

## 💡 The Solution

Upload a selfie, choose a hairstyle preset or write your own prompt, and Hairrison generates an AI preview of the new look.

It gives users a simple before-and-after comparison so they can explore styles without commitment.

---

## ✅ Features

- 📸 Upload a selfie
- 💇 Choose from 26+ hairstyle presets
- ✍️ Enter a custom hairstyle prompt
- ⚡ Generate an AI hairstyle preview
- 🔍 Compare before and after
- 💾 Download the final image

---

## 🛠 Tech Stack

- **React 19**
- **TypeScript**
- **Vite**
- **Cloudinary Upload Widget**
- **Cloudinary Generative Replace**
- **Cloudinary URL Gen SDK**

---

## 🎯 Why It Stands Out

- **Technical Execution:** working end-to-end upload, transform, compare, and download flow
- **Innovation:** uses AI for a relatable real-world decision, not just a novelty effect
- **Design:** simple, clear, and easy to demo
- **Presentation:** easy to explain in one sentence:
  **“See yourself with a new hairstyle before committing to it.”**

---

## 🚀 Getting Started

Clone the repo and install dependencies:

```bash
git clone https://github.com/mutms7/Hairrison.git
cd Hairrison
npm install
```

Create a `.env` file in the project root:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

Start the development server:

```bash
npm run dev
```
