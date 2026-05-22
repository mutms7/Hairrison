import { Cloudinary } from '@cloudinary/url-gen';
import { generativeReplace } from '@cloudinary/url-gen/actions/effect';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;

const cld = new Cloudinary({ cloud: { cloudName: CLOUD_NAME } });

/**
 * Build a Cloudinary Generative Replace URL that swaps
 * the subject's hair to the described hairstyle.
 */
export function buildHairTransformUrl(publicId: string, hairstylePrompt: string): string {
  // Commas are Cloudinary transformation step separators — strip them from the prompt
  const cleanPrompt = hairstylePrompt.replace(/,/g, '');
  return cld.image(publicId)
    .effect(generativeReplace().from('hair').to(cleanPrompt))
    .toURL();
}

/**
 * Build a direct Cloudinary delivery URL (no transformation).
 */
export function buildRawUrl(publicId: string): string {
  return cld.image(publicId).toURL();
}

/**
 * Build a Cloudinary URL with auto quality/format optimisation.
 */
export function buildOptimisedUrl(publicId: string, width = 800): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,w_${width}/${publicId}`;
}
