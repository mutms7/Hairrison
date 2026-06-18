// ─────────────────────────────────────────────────────────────
// Hairstyle presets. These are here to spark ideas; the real star
// is the custom prompt builder. Every preset carries a real
// reference photo (Unsplash) so people can see the look before
// they try it on themselves.
// ─────────────────────────────────────────────────────────────

export type Gender = 'Women' | 'Men';
export type Length = 'Short' | 'Medium' | 'Long';
export type Texture = 'Straight' | 'Wavy' | 'Curly';

export interface Hairstyle {
  id: string;
  name: string;
  tagline: string;
  /** Short, clean phrase fed to Cloudinary. Keep it simple. */
  genPrompt: string;
  /** Unsplash photo base URL (no query string). */
  image: string;
  gender: Gender;
  length: Length;
  texture: Texture;
  trending?: boolean;
}

const U = (id: string) => `https://images.unsplash.com/photo-${id}`;

export const HAIRSTYLES: Hairstyle[] = [
  // ── WOMEN ─────────────────────────────────────────────────
  {
    id: 'classic-bob',
    name: 'Classic Bob',
    tagline: 'Timeless & polished',
    genPrompt: 'a sleek straight chin-length bob',
    image: U('1604057883945-2b8b91ea1575'),
    gender: 'Women',
    length: 'Short',
    texture: 'Straight',
    trending: true,
  },
  {
    id: 'pixie-cut',
    name: 'Pixie Cut',
    tagline: 'Daring & chic',
    genPrompt: 'a short textured pixie cut',
    image: U('1471017851983-fc49d89c57c2'),
    gender: 'Women',
    length: 'Short',
    texture: 'Straight',
  },
  {
    id: 'curly-crop',
    name: 'Curly Crop',
    tagline: 'Bouncy & bold',
    genPrompt: 'short bouncy defined curls',
    image: U('1632765854612-9b02b6ec2b15'),
    gender: 'Women',
    length: 'Short',
    texture: 'Curly',
  },
  {
    id: 'beach-waves',
    name: 'Beach Waves',
    tagline: 'Effortlessly cool',
    genPrompt: 'loose shoulder-length beach waves',
    image: U('1571070347483-9d9b1f8ab915'),
    gender: 'Women',
    length: 'Medium',
    texture: 'Wavy',
    trending: true,
  },
  {
    id: 'curtain-bangs',
    name: 'Curtain Bangs',
    tagline: 'Soft framing fringe',
    genPrompt: 'medium-length hair with curtain bangs',
    image: U('1565906353471-db6555b67554'),
    gender: 'Women',
    length: 'Medium',
    texture: 'Wavy',
  },
  {
    id: 'natural-afro',
    name: 'Natural Afro',
    tagline: 'Texture celebrated',
    genPrompt: 'a full natural afro',
    image: U('1519699047748-de8e457a634e'),
    gender: 'Women',
    length: 'Medium',
    texture: 'Curly',
    trending: true,
  },
  {
    id: 'glass-hair',
    name: 'Glass Hair',
    tagline: 'Mirror-finish sleek',
    genPrompt: 'long ultra-straight glossy hair',
    image: U('1496440737103-cd596325d314'),
    gender: 'Women',
    length: 'Long',
    texture: 'Straight',
  },
  {
    id: 'long-layers',
    name: 'Long Layers',
    tagline: 'Flowing & romantic',
    genPrompt: 'long hair with face-framing layers',
    image: U('1678271215818-3d2912e383ef'),
    gender: 'Women',
    length: 'Long',
    texture: 'Straight',
  },
  {
    id: 'long-curls',
    name: 'Long Curls',
    tagline: 'Romantic spirals',
    genPrompt: 'long voluminous curls',
    image: U('1500917293891-ef795e70e1f6'),
    gender: 'Women',
    length: 'Long',
    texture: 'Curly',
  },
  {
    id: 'mermaid-waves',
    name: 'Mermaid Waves',
    tagline: 'Long & dreamy',
    genPrompt: 'long flowing mermaid waves',
    image: U('1593529334658-a243a47ad02e'),
    gender: 'Women',
    length: 'Long',
    texture: 'Wavy',
    trending: true,
  },

  // ── MEN ───────────────────────────────────────────────────
  {
    id: 'buzz-cut',
    name: 'Buzz Cut',
    tagline: 'Minimal icon',
    genPrompt: 'a very short buzz cut',
    image: U('1761792390398-717211a593db'),
    gender: 'Men',
    length: 'Short',
    texture: 'Straight',
  },
  {
    id: 'crew-cut',
    name: 'Crew Cut',
    tagline: 'Clean classic',
    genPrompt: 'a short tapered crew cut',
    image: U('1672155408799-024306d7856d'),
    gender: 'Men',
    length: 'Short',
    texture: 'Straight',
  },
  {
    id: 'textured-fade',
    name: 'Textured Fade',
    tagline: 'Edge & texture',
    genPrompt: 'a textured crop with a skin fade',
    image: U('1630827020718-3433092696e7'),
    gender: 'Men',
    length: 'Short',
    texture: 'Straight',
    trending: true,
  },
  {
    id: 'textured-crop',
    name: 'Textured Crop',
    tagline: 'Modern & sharp',
    genPrompt: 'a short textured crop with a fringe',
    image: U('1629189784191-9afdcbcb0398'),
    gender: 'Men',
    length: 'Short',
    texture: 'Straight',
  },
  {
    id: 'slicked-back',
    name: 'Slicked Back',
    tagline: 'Old-money polish',
    genPrompt: 'slicked-back glossy hair',
    image: U('1618049049816-43a00d5b0c3d'),
    gender: 'Men',
    length: 'Short',
    texture: 'Straight',
  },
  {
    id: 'pompadour',
    name: 'Pompadour',
    tagline: 'Volume up top',
    genPrompt: 'a voluminous pompadour with short sides',
    image: U('1456327102063-fb5054efe647'),
    gender: 'Men',
    length: 'Short',
    texture: 'Straight',
  },
  {
    id: 'curly-top',
    name: 'Curly Top',
    tagline: 'Natural & textured',
    genPrompt: 'short curly hair on top with tapered sides',
    image: U('1522075469751-3a6694fb2f61'),
    gender: 'Men',
    length: 'Short',
    texture: 'Curly',
    trending: true,
  },
  {
    id: 'curtain-fringe',
    name: 'Curtain Fringe',
    tagline: 'Soft-boy era',
    genPrompt: 'medium-length hair with a centre-parted curtain fringe',
    image: U('1513956589380-bad6acb9b9d4'),
    gender: 'Men',
    length: 'Medium',
    texture: 'Wavy',
  },
  {
    id: 'man-bun',
    name: 'Man Bun',
    tagline: 'Effortless cool',
    genPrompt: 'longer hair tied back in a man bun',
    image: U('1512663150964-d8f43c899f76'),
    gender: 'Men',
    length: 'Long',
    texture: 'Straight',
  },
  {
    id: 'long-flow',
    name: 'Long Flow',
    tagline: 'Rockstar waves',
    genPrompt: 'long wavy flowing hair',
    image: U('1635567818469-e28cdf45c1f5'),
    gender: 'Men',
    length: 'Long',
    texture: 'Wavy',
  },
];

export const TRENDING_HAIRSTYLES = HAIRSTYLES.filter((h) => h.trending);

export const ALL_GENDERS: Gender[] = ['Women', 'Men'];
export const ALL_LENGTHS: Length[] = ['Short', 'Medium', 'Long'];
export const ALL_TEXTURES: Texture[] = ['Straight', 'Wavy', 'Curly'];

/** Append delivery params to an Unsplash base URL. */
export function styleImage(base: string, w = 600, h = 750): string {
  return `${base}?auto=format&fit=crop&w=${w}&h=${h}&q=70`;
}

// ── PROMPT BUILDER MODIFIERS ───────────────────────────────
export interface Modifier {
  id: string;
  label: string;
  prompt: string;
}

export const LENGTH_MODS: Modifier[] = [
  { id: 'len-buzz', label: 'Buzzed', prompt: 'very short buzzed' },
  { id: 'len-short', label: 'Short', prompt: 'short' },
  { id: 'len-chin', label: 'Chin', prompt: 'chin-length' },
  { id: 'len-shoulder', label: 'Shoulder', prompt: 'shoulder-length' },
  { id: 'len-long', label: 'Long', prompt: 'long' },
  { id: 'len-waist', label: 'Waist', prompt: 'very long waist-length' },
];

export const TEXTURE_MODS: Modifier[] = [
  { id: 'tex-straight', label: 'Straight', prompt: 'straight' },
  { id: 'tex-wavy', label: 'Wavy', prompt: 'wavy' },
  { id: 'tex-curly', label: 'Curly', prompt: 'curly' },
  { id: 'tex-coily', label: 'Coily', prompt: 'coily' },
  { id: 'tex-braided', label: 'Braided', prompt: 'braided' },
  { id: 'tex-locs', label: 'Locs', prompt: 'in locs' },
];

export const COLOR_MODS: Modifier[] = [
  { id: 'col-natural', label: 'Keep my color', prompt: '' },
  { id: 'col-jetblack', label: 'Jet black', prompt: 'jet black' },
  { id: 'col-espresso', label: 'Brown', prompt: 'dark brown' },
  { id: 'col-caramel', label: 'Caramel', prompt: 'caramel highlights' },
  { id: 'col-honey', label: 'Honey blonde', prompt: 'honey blonde' },
  { id: 'col-platinum', label: 'Platinum', prompt: 'platinum blonde' },
  { id: 'col-copper', label: 'Copper', prompt: 'copper red' },
  { id: 'col-rose', label: 'Rose gold', prompt: 'rose gold' },
  { id: 'col-silver', label: 'Silver', prompt: 'silver grey' },
];

/**
 * Compile prompt-builder selections into a single short generative
 * phrase. We keep it lean on purpose: long, comma-heavy prompts
 * confuse Cloudinary's generative replace and muddy the result.
 */
export function composePrompt(parts: {
  base?: string;
  length?: Modifier | null;
  texture?: Modifier | null;
  color?: Modifier | null;
}): string {
  const base = parts.base?.trim();

  // If the user typed something free-form, trust it and just layer
  // colour on if they picked one. No boilerplate.
  if (base) {
    return [base, parts.color?.prompt].filter(Boolean).join(' ');
  }

  const descriptors = [
    parts.length?.prompt,
    parts.texture?.prompt,
    parts.color?.prompt,
  ].filter((s): s is string => Boolean(s && s.length));

  if (descriptors.length === 0) return '';
  return `${descriptors.join(' ')} hair`;
}
