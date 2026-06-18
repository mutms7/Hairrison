import { Cloudinary } from '@cloudinary/url-gen';
import { generativeReplace } from '@cloudinary/url-gen/actions/effect';

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;

export const isCloudinaryConfigured = Boolean(cloudName);

export const cld = new Cloudinary({
  cloud: { cloudName: cloudName || 'demo' },
});

export const uploadPreset = (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string) || '';

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
}

/**
 * Build a Cloudinary Generative Replace URL that swaps the
 * subject's hair for whatever the prompt describes.
 *
 * We keep the prompt as close to what the user asked for as
 * possible, just tidied: commas are Cloudinary's transformation
 * step separators (and slashes break URLs), so we strip those and
 * collapse whitespace. Nothing else gets appended, short and
 * literal prompts give the most accurate result.
 */
export function buildHairTransformUrl(publicId: string, prompt: string): string {
  const cleanPrompt = prompt
    .replace(/[,/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return cld
    .image(publicId)
    .effect(generativeReplace().from('hair').to(cleanPrompt))
    .toURL();
}

/** Direct optimized delivery URL (no generative transformation). */
export function buildOptimisedUrl(publicId: string, width = 900): string {
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_${width}/${publicId}`;
}

/**
 * Pre-warm a generative URL. Cloudinary processes the transformation on
 * first request, which can take 15–60s. Resolves with the URL on success.
 */
export function warmTransform(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () =>
      reject(
        new Error(
          'Generation failed. Cloudinary could not process this image. Try a clearer, front-facing photo.'
        )
      );
    img.src = url;
  });
}
