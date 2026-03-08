# Hairrison — AI Hair Try-On  
### Built by William Chenyin for Hack Canada 2026

> Try the haircut before the haircut.
>
> 

Hairrison is a hackathon project I built for people who have ever wondered, “Would this hairstyle actually look good on me?” Instead of guessing in the mirror or risking a bad salon decision, users can upload a photo, pick a hairstyle, and get an AI-generated preview in seconds.

The name **Hairrison** comes from the idea of **hair comparison** — helping users compare possible hairstyles on their own photo before making a real change.

I wanted to make hairstyle exploration feel low-pressure, fast, and actually fun.

---

## The Problem

Changing your hair is weirdly high-stakes.

A new cut or style can completely change how you look, but most people are making that decision with:
- vague imagination,
- reference photos of other people,
- and a lot of hope.

That gap between **“I think this might work”** and **“I know what this looks like on me”** is what Hairrison tries to solve.

---

## My Solution

Hairrison is an AI-powered hair visualization tool that lets users upload a selfie and preview different hairstyles on their own face.

Using Cloudinary’s generative replace workflow, I replace the detected hair region with either:
- curated hairstyle presets, or
- a custom natural-language prompt written by the user.

The result is a simple before/after experience that helps people explore new looks without commitment.

---

## Why I Built It

I liked the idea of taking something that is usually emotional, subjective, and risky — changing your hair — and turning it into an interactive visual tool.

What made this project exciting to build was that it’s not just an AI demo. It’s a product people immediately understand:

- Upload a photo  
- Pick a style  
- See yourself differently  

That made it a great challenge for combining generative AI, image transformation, frontend UX, and a playful but genuinely useful idea.

---

## What It Does

- Upload a selfie
- Choose from 26+ hairstyle presets
- Enter a custom hairstyle prompt in natural language
- Generate an AI hair transformation in seconds
- Compare before and after side by side
- Download the final result

---

## Demo Flow

Hairrison is designed to be easy to understand in under a minute:

1. Upload a photo  
2. Pick a preset or describe a hairstyle  
3. Generate the transformed image  
4. Compare the original and transformed result  
5. Download the final image  

That clear flow was important to me because it makes the project easy to demo and easy to judge.

---

## Judging Criteria Breakdown

### Technical Execution

Hairrison is a working end-to-end application with:
- image upload,
- AI-powered transformation,
- prompt-driven customization,
- result rendering,
- and downloadable output.

I built it using:
- **React 19**
- **TypeScript**
- **Vite**
- **Cloudinary Upload Widget**
- **Cloudinary URL Gen / Generative Replace**

This setup keeps the app lightweight, responsive, and practical beyond a local-only demo. Cloudinary also makes the image pipeline more scalable than a one-off proof of concept. The Hack Canada submission page specifically asks for a public repo, a fun README, and a list of tools/libraries used, so I wanted the project to be clear and complete on those fronts. :contentReference[oaicite:1]{index=1}

### Innovation and Creativity

There are lots of AI image apps, but Hairrison reframes generative AI around a very specific and relatable problem: **hair uncertainty**.

What makes it creative is that it turns AI into a decision-support tool rather than just a novelty effect. Instead of “make a cool image,” the product answers questions like:
- Should I get bangs?
- Would short hair suit me?
- What would a different style look like on me?

That makes the experience feel more personal, useful, and memorable.

### Design and User Experience

I focused on making the experience:
- obvious,
- low-friction,
- and visually consistent.

The app follows a clean flow from upload to result. It supports both guided exploration through presets and open-ended exploration through custom prompts. The side-by-side comparison makes the result instantly understandable for users and judges.

### Presentation and Communication

Hairrison is easy to explain because the value proposition is immediate:

**“See yourself with a new hairstyle before committing to it.”**

That clarity helps both in the README and in the live demo. The project has:
- a clear problem,
- a clear transformation step,
- and a clear visual payoff.

That makes it strong for presentation as well as functionality.

---

## Tech Stack

- **Frontend:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** CSS
- **AI/Image Transformation:** Cloudinary Generative Replace
- **Image Delivery:** Cloudinary URL Gen SDK
- **Uploads:** Cloudinary Upload Widget

---

## How It Works

At a high level:

1. The user uploads a photo  
2. The image is stored through Cloudinary  
3. The user selects a preset or writes a custom hairstyle prompt  
4. A transformation URL is generated using the hairstyle prompt  
5. The transformed image is displayed beside the original  

This creates a fast, visual, and interactive way to test hairstyle ideas without real-world risk.

---

## What I’m Proud Of

I’m proud that Hairrison feels like a real product, not just a technical proof of concept.

The best part of the project is how quickly someone can understand its value:
- it solves a real hesitation,
- it produces an instantly visible result,
- and it makes AI feel practical and fun at the same time.

---

## What I’d Build Next

Given more time, I’d want to add:
- hairstyle recommendations based on face shape
- saved style history
- better personalization for hair texture and length
- mobile-first polish
- shareable result links
- salon or stylist integrations

That would move Hairrison from a hackathon prototype toward a real consumer tool.

---

## Getting Started

```bash
git clone https://github.com/mutms7/Hairrison.git
cd Hairrison
npm install
npm run dev
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

