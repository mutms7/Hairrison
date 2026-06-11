import { useCallback, useEffect, useState } from 'react';
import { UploadWidget } from './UploadWidget';
import { MirrorCompare } from './MirrorCompare';
import { PromptBuilder } from './PromptBuilder';
import { LooksLibrary } from './LooksLibrary';
import { Paywall } from './Paywall';
import {
  buildHairTransformUrl,
  buildOptimisedUrl,
  warmTransform,
} from '../lib/cloudinary';
import type { CloudinaryUploadResult } from '../lib/cloudinary';
import {
  canGenerate,
  recordGeneration,
  hasUnlimited,
  freeCreditsRemaining,
} from '../lib/entitlements';
import { addToHistory } from '../lib/history';
import type { LookRecord } from '../lib/history';
import type { Hairstyle } from '../data/looks';

const MAX_LOOKS = 3;

interface GeneratedLook {
  id: string;
  label: string;
  prompt: string;
  url: string;
  status: 'pending' | 'done' | 'error';
  error?: string;
}

interface Props {
  onHistoryChange: (records: LookRecord[]) => void;
}

export function Studio({ onHistoryChange }: Props) {
  const [photo, setPhoto] = useState<CloudinaryUploadResult | null>(null);
  const [selected, setSelected] = useState<Hairstyle[]>([]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [results, setResults] = useState<GeneratedLook[]>([]);
  const [activeResult, setActiveResult] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [, setTick] = useState(0); // re-render after entitlement changes

  const beforeUrl = photo ? buildOptimisedUrl(photo.public_id) : null;

  const toggleLook = useCallback((style: Hairstyle) => {
    setSelected((prev) =>
      prev.some((s) => s.id === style.id)
        ? prev.filter((s) => s.id !== style.id)
        : [...prev, style].slice(0, MAX_LOOKS)
    );
  }, []);

  const onUpload = useCallback((result: CloudinaryUploadResult) => {
    setPhoto(result);
    setResults([]);
    setActiveResult(null);
    setError(null);
  }, []);

  const onUploadError = useCallback((msg: string) => setError(`Upload failed: ${msg}`), []);

  const queue: { label: string; prompt: string }[] = [
    ...selected.map((s) => ({ label: s.name, prompt: s.genPrompt })),
    ...(customPrompt ? [{ label: 'Custom look', prompt: customPrompt }] : []),
  ].slice(0, MAX_LOOKS);

  const generate = async () => {
    if (!photo) {
      setError('Upload your photo first.');
      return;
    }
    if (queue.length === 0) {
      setError('Pick a look from the library or build a custom prompt.');
      return;
    }
    if (!canGenerate()) {
      setShowPaywall(true);
      return;
    }

    setError(null);
    setGenerating(true);

    // One press = one generation credit, regardless of how many looks are queued.
    recordGeneration();
    setTick((t) => t + 1);

    const pending: GeneratedLook[] = queue.map((q, i) => ({
      id: `${Date.now()}-${i}`,
      label: q.label,
      prompt: q.prompt,
      url: buildHairTransformUrl(photo.public_id, q.prompt),
      status: 'pending',
    }));
    setResults(pending);
    setActiveResult(pending[0].id);

    await Promise.all(
      pending.map(async (look) => {
        try {
          await warmTransform(look.url);
          setResults((prev) =>
            prev.map((r) => (r.id === look.id ? { ...r, status: 'done' } : r))
          );
          const record: LookRecord = {
            id: look.id,
            label: look.label,
            prompt: look.prompt,
            beforeUrl: beforeUrl!,
            afterUrl: look.url,
            createdAt: new Date().toISOString(),
          };
          onHistoryChange(addToHistory(record));
        } catch (e) {
          setResults((prev) =>
            prev.map((r) =>
              r.id === look.id
                ? { ...r, status: 'error', error: e instanceof Error ? e.message : 'Failed' }
                : r
            )
          );
        }
      })
    );
    setGenerating(false);
  };

  const active = results.find((r) => r.id === activeResult) ?? results[0] ?? null;

  const download = async (url: string, label: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `hairrison-${label.toLowerCase().replace(/\s+/g, '-')}.jpg`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      window.open(url, '_blank');
    }
  };

  // Close the paywall automatically if the user becomes unlimited
  useEffect(() => {
    if (showPaywall && hasUnlimited()) setShowPaywall(false);
  }, [showPaywall]);

  return (
    <section className="studio" id="studio">
      <div className="studio-header">
        <span className="eyebrow">The Studio</span>
        <h2>Three steps to your next look</h2>
        <p className="studio-credits">
          {hasUnlimited()
            ? 'Studio member · unlimited looks'
            : `${freeCreditsRemaining()} free generation left · unlimited for $0.99`}
        </p>
      </div>

      <div className="studio-steps">
        {/* STEP 1 — PHOTO */}
        <div className="studio-step">
          <h3 className="step-title">
            <span className="step-no">I</span> Your photo
          </h3>
          {beforeUrl ? (
            <div className="photo-frame">
              <img src={beforeUrl} alt="Your uploaded photo" />
              <UploadWidget onSuccess={onUpload} onError={onUploadError} label="Replace photo" />
            </div>
          ) : (
            <div className="photo-placeholder">
              <p>A clear, front-facing photo works best. It stays in your Cloudinary library.</p>
              <UploadWidget onSuccess={onUpload} onError={onUploadError} />
            </div>
          )}
        </div>

        {/* STEP 2 — LOOKS */}
        <div className="studio-step">
          <h3 className="step-title">
            <span className="step-no">II</span> Pick up to {MAX_LOOKS} looks
          </h3>
          <LooksLibrary
            selectedIds={selected.map((s) => s.id)}
            onToggle={toggleLook}
            maxSelectable={MAX_LOOKS - (customPrompt ? 1 : 0)}
          />
          <details className="builder-details">
            <summary>Or build your own look</summary>
            <PromptBuilder onPromptChange={setCustomPrompt} />
          </details>
        </div>

        {/* STEP 3 — GENERATE */}
        <div className="studio-step">
          <h3 className="step-title">
            <span className="step-no">III</span> See it
          </h3>
          <div className="queue-summary">
            {queue.length > 0 ? (
              queue.map((q) => (
                <span key={q.label} className="queue-pill">
                  {q.label}
                </span>
              ))
            ) : (
              <span className="queue-empty">Nothing queued yet</span>
            )}
          </div>
          <button
            className="btn btn-primary btn-generate"
            onClick={generate}
            disabled={generating}
          >
            {generating
              ? 'Generating… (15–60s)'
              : queue.length > 1
                ? `Generate ${queue.length} looks`
                : 'Generate my look'}
          </button>
          {error && <p className="error-text">{error}</p>}
        </div>
      </div>

      {/* RESULTS */}
      {results.length > 0 && beforeUrl && (
        <div className="results">
          {results.length > 1 && (
            <div className="results-tabs">
              {results.map((r) => (
                <button
                  key={r.id}
                  className={`chip ${active?.id === r.id ? 'chip-active' : ''}`}
                  onClick={() => setActiveResult(r.id)}
                >
                  {r.label}
                  {r.status === 'pending' && ' · …'}
                  {r.status === 'error' && ' · failed'}
                </button>
              ))}
            </div>
          )}
          {active && active.status === 'done' && (
            <>
              <MirrorCompare beforeUrl={beforeUrl} afterUrl={active.url} afterLabel={active.label} />
              <div className="results-actions">
                <button className="btn btn-secondary" onClick={() => download(active.url, active.label)}>
                  Download
                </button>
              </div>
            </>
          )}
          {active && active.status === 'pending' && (
            <div className="result-loading">
              <div className="loading-shimmer" />
              <p>Styling “{active.label}” — generative AI takes 15–60 seconds on the first render.</p>
            </div>
          )}
          {active && active.status === 'error' && <p className="error-text">{active.error}</p>}
        </div>
      )}

      {showPaywall && (
        <Paywall
          freeRemaining={freeCreditsRemaining()}
          unlimited={hasUnlimited()}
          asModal
          onClose={() => setShowPaywall(false)}
        />
      )}
    </section>
  );
}
