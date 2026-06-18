import { useCallback, useEffect, useState } from 'react';
import { UploadWidget } from './UploadWidget';
import { MirrorCompare } from './MirrorCompare';
import { PromptBuilder } from './PromptBuilder';
import { LooksLibrary } from './LooksLibrary';
import { Paywall } from './Paywall';
import { buildHairTransformUrl, buildOptimisedUrl, warmTransform } from '../lib/cloudinary';
import type { CloudinaryUploadResult } from '../lib/cloudinary';
import {
  canGenerate,
  recordGeneration,
  hasUnlimited,
  hasPaid,
  isDevMode,
  freePromptRemaining,
  freePresetRemaining,
  watchForDevCode,
} from '../lib/entitlements';
import type { LookKind } from '../lib/entitlements';
import { addToHistory } from '../lib/history';
import type { LookRecord } from '../lib/history';
import type { Hairstyle } from '../data/looks';

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
  const [customPrompt, setCustomPrompt] = useState('');
  const [results, setResults] = useState<GeneratedLook[]>([]);
  const [activeResult, setActiveResult] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [devJustUnlocked, setDevJustUnlocked] = useState(false);
  const [, setTick] = useState(0); // re-render after entitlement changes

  const beforeUrl = photo ? buildOptimisedUrl(photo.public_id) : null;

  // Secret unlock: type the code anywhere (including the prompt box).
  useEffect(
    () =>
      watchForDevCode(() => {
        setDevJustUnlocked(true);
        setTick((t) => t + 1);
      }),
    []
  );

  const onUpload = useCallback((result: CloudinaryUploadResult) => {
    setPhoto(result);
    setError(null);
  }, []);

  const onUploadError = useCallback((msg: string) => setError(`Upload failed: ${msg}`), []);

  const generateLook = useCallback(
    async (opts: { kind: LookKind; label: string; prompt: string; styleId: string }) => {
      const prompt = opts.prompt.trim();
      if (!photo || !beforeUrl) {
        setError('Upload your photo first.');
        document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      if (!prompt) {
        setError('Describe a look first, then generate.');
        return;
      }
      if (!canGenerate(opts.kind)) {
        setShowPaywall(true);
        return;
      }

      setError(null);
      setBusyId(opts.styleId);
      recordGeneration(opts.kind);
      setTick((t) => t + 1);

      const id = `${Date.now()}`;
      const url = buildHairTransformUrl(photo.public_id, prompt);
      const look: GeneratedLook = { id, label: opts.label, prompt, url, status: 'pending' };
      setResults((prev) => [look, ...prev]);
      setActiveResult(id);

      try {
        await warmTransform(url);
        setResults((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: 'done' } : r))
        );
        const record: LookRecord = {
          id,
          label: opts.label,
          prompt,
          beforeUrl,
          afterUrl: url,
          createdAt: new Date().toISOString(),
        };
        onHistoryChange(addToHistory(record));
      } catch (e) {
        setResults((prev) =>
          prev.map((r) =>
            r.id === id
              ? { ...r, status: 'error', error: e instanceof Error ? e.message : 'Failed' }
              : r
          )
        );
      } finally {
        setBusyId(null);
      }
    },
    [photo, beforeUrl, onHistoryChange]
  );

  const generateCustom = () =>
    generateLook({ kind: 'prompt', label: 'Custom look', prompt: customPrompt, styleId: 'custom' });

  const tryPreset = (style: Hairstyle) =>
    generateLook({
      kind: 'preset',
      label: style.name,
      prompt: style.genPrompt,
      styleId: style.id,
    });

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

  // Close the paywall automatically if the user becomes unlimited.
  useEffect(() => {
    if (showPaywall && hasUnlimited()) setShowPaywall(false);
  }, [showPaywall]);

  const unlimited = hasUnlimited();
  const presetLocked = !unlimited && freePresetRemaining() === 0;
  const promptLocked = !unlimited && freePromptRemaining() === 0;

  const creditLine = unlimited
    ? isDevMode() && !hasPaid()
      ? 'Dev mode on · unlimited looks'
      : 'Studio member · unlimited looks'
    : `${freePromptRemaining()} free custom look + ${freePresetRemaining()} free preset remaining · unlimited for $1.99`;

  return (
    <section className="studio" id="studio">
      <div className="studio-header">
        <span className="eyebrow">The Studio</span>
        <h2>Build your look, then see it</h2>
        <p className="studio-credits">{creditLine}</p>
      </div>

      {devJustUnlocked && (
        <div className="banner banner-success">
          Dev mode unlocked. Generate as many looks as you like on this device.
        </div>
      )}

      <div className="studio-steps">
        {/* STEP 1: PHOTO */}
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

        {/* STEP 2: BUILD YOUR OWN — the main event */}
        <div className="studio-step studio-step-feature">
          <h3 className="step-title">
            <span className="step-no">II</span> Build your own look
          </h3>
          <p className="step-lead">
            This is the heart of Hairrison. Describe anything and we'll render it onto
            your photo. The presets below are just here to spark ideas.
          </p>
          <PromptBuilder onPromptChange={setCustomPrompt} />
          <button
            className="btn btn-primary btn-generate"
            onClick={generateCustom}
            disabled={busyId !== null}
          >
            {busyId === 'custom'
              ? 'Generating… (15–60s)'
              : promptLocked
                ? 'Generate my look · $1.99'
                : 'Generate my look'}
          </button>
          {error && <p className="error-text">{error}</p>}
        </div>

        {/* STEP 3: PRESETS — inspiration gallery */}
        <div className="studio-step">
          <h3 className="step-title">
            <span className="step-no">III</span> Or get inspired
          </h3>
          <p className="step-lead">
            Browse real looks for women and men, filter by length and texture, then tap to
            try one on. Your first preset is free.
          </p>
          <LooksLibrary onTry={tryPreset} busyId={busyId} locked={presetLocked} />
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
              <p>Styling “{active.label}”. Generative AI takes 15 to 60 seconds on the first render.</p>
            </div>
          )}
          {active && active.status === 'error' && <p className="error-text">{active.error}</p>}
        </div>
      )}

      {showPaywall && (
        <Paywall
          freeRemaining={freePromptRemaining() + freePresetRemaining()}
          unlimited={unlimited}
          asModal
          onClose={() => setShowPaywall(false)}
        />
      )}
    </section>
  );
}
