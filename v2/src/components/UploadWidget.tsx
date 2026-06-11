import { useEffect, useRef, useState } from 'react';
import { isCloudinaryConfigured, uploadPreset } from '../lib/cloudinary';
import type { CloudinaryUploadResult } from '../lib/cloudinary';

// Unsigned uploads need both a cloud name and an upload preset. Without
// either, the Cloudinary widget is created but `.open()` silently no-ops,
// which looks like a dead button. Detect that up front instead.
const isConfigured = isCloudinaryConfigured && Boolean(uploadPreset);

interface WidgetResult {
  event: string;
  info: CloudinaryUploadResult;
}

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        config: Record<string, unknown>,
        callback: (error: { message?: string } | null, result: WidgetResult | null) => void
      ) => { open: () => void };
    };
  }
}

interface Props {
  onSuccess: (result: CloudinaryUploadResult) => void;
  onError: (message: string) => void;
  label?: string;
}

export function UploadWidget({ onSuccess, onError, label = 'Upload your photo' }: Props) {
  const widgetRef = useRef<{ open: () => void } | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed' | 'unconfigured'>(
    isConfigured ? 'loading' : 'unconfigured'
  );

  useEffect(() => {
    if (!isConfigured) return;
    let mounted = true;
    const ready = () => typeof window.cloudinary?.createUploadWidget === 'function';

    const init = () => {
      if (!mounted || !ready()) return;
      widgetRef.current = window.cloudinary!.createUploadWidget(
        {
          cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
          uploadPreset: uploadPreset || undefined,
          sources: ['local', 'camera', 'url'],
          multiple: false,
          cropping: false,
          maxFileSize: 10_000_000,
        },
        (error, result) => {
          if (error) {
            onError(error.message || 'Upload failed');
            return;
          }
          if (result?.event === 'success') onSuccess(result.info);
        }
      );
      setStatus('ready');
    };

    if (ready()) {
      init();
      return () => {
        mounted = false;
      };
    }

    const poll = setInterval(() => {
      if (ready()) {
        clearInterval(poll);
        clearTimeout(timeout);
        init();
      }
    }, 100);
    const timeout = setTimeout(() => {
      clearInterval(poll);
      if (mounted && !ready()) setStatus('failed');
    }, 10_000);

    return () => {
      mounted = false;
      clearInterval(poll);
      clearTimeout(timeout);
    };
  }, [onSuccess, onError]);

  if (status === 'unconfigured') {
    return (
      <p className="error-text">
        Photo upload isn't configured. Set <code>VITE_CLOUDINARY_CLOUD_NAME</code> and{' '}
        <code>VITE_CLOUDINARY_UPLOAD_PRESET</code> (an unsigned preset) in <code>v2/.env</code>,
        then restart the dev server.
      </p>
    );
  }

  if (status === 'failed') {
    return <p className="error-text">The upload tool didn't load. Refresh the page to try again.</p>;
  }

  return (
    <button
      type="button"
      className="btn btn-primary"
      disabled={status !== 'ready'}
      onClick={() => widgetRef.current?.open()}
    >
      {status === 'ready' ? label : 'Loading…'}
    </button>
  );
}
