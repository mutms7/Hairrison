import { useState, useCallback, useRef } from 'react';
import { UploadWidget } from '../cloudinary/UploadWidget';
import type { CloudinaryUploadResult } from '../cloudinary/UploadWidget';
import { PRESET_HAIRSTYLES, getRandomHairstyle } from '../data/hairstyles';
import type { Hairstyle } from '../data/hairstyles';
import { buildHairTransformUrl, buildOptimisedUrl } from '../cloudinary/hairTransform';

type StyleInputMode = 'preset' | 'description';

interface HairToolProps {
  onGoToMarketplace: () => void;
  selectedStyle?: Hairstyle | null;
  onClearSelectedStyle?: () => void;
}

export function HairTool({ onGoToMarketplace, selectedStyle, onClearSelectedStyle }: HairToolProps) {
  const [uploadedImage, setUploadedImage] = useState<CloudinaryUploadResult | null>(null);
  const [mode, setMode] = useState<StyleInputMode>('preset');
  const [activePreset, setActivePreset] = useState<Hairstyle | null>(selectedStyle ?? null);
  const [description, setDescription] = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformError, setTransformError] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Sync externally-selected style (from Marketplace)
  if (selectedStyle && selectedStyle !== activePreset) {
    setActivePreset(selectedStyle);
    setMode('preset');
    onClearSelectedStyle?.();
  }

  const handleUploadSuccess = useCallback((result: CloudinaryUploadResult) => {
    setUploadedImage(result);
    setResultUrl(null);
    setTransformError(null);
  }, []);

  const handleUploadError = useCallback((error: Error) => {
    setTransformError(`Upload failed: ${error.message}`);
  }, []);

  const handleFeelingLucky = () => {
    const random = getRandomHairstyle();
    setActivePreset(random);
    setMode('preset');
  };

  const getActivePrompt = (): string => {
    if (mode === 'preset' && activePreset) return activePreset.genPrompt;
    if (mode === 'description' && description.trim()) return description.trim();
    return '';
  };

  const handleImagine = () => {
    const prompt = getActivePrompt();
    if (!uploadedImage) {
      setTransformError('Please upload your photo first.');
      return;
    }
    if (!prompt) {
      setTransformError(
        mode === 'preset'
          ? 'Please select a hairstyle preset.'
          : 'Please describe the hairstyle you want.'
      );
      return;
    }

    setIsTransforming(true);
    setTransformError(null);
    setResultUrl(null);
    setShowComparison(false);

    const url = buildHairTransformUrl(uploadedImage.public_id, prompt);
    // Pre-load the image; Cloudinary processes on first request
    const img = new Image();
    img.onload = () => {
      setResultUrl(url);
      setIsTransforming(false);
      setShowComparison(true);
    };
    img.onerror = () => {
      setIsTransforming(false);
      setTransformError('ADDON_REQUIRED');
    };
    img.src = url;
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = 'hairrison-transformation.jpg';
    a.target = '_blank';
    a.click();
  };

  const originalUrl = uploadedImage ? buildOptimisedUrl(uploadedImage.public_id, 800) : null;

  return (
    <section style={{ minHeight: '100vh', padding: '100px 2rem 80px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '3rem', animation: 'fadeUp 0.5s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '0.75rem' }}>
            <div style={{ height: 1, width: 32, background: 'var(--color-accent)' }} />
            <span style={{
              fontSize: '0.75rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
            }}>
              The Visualiser
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', letterSpacing: '-0.02em' }}>
            Try a New Style
          </h1>
          <p style={{ fontSize: '1.1rem', marginTop: '0.5rem', maxWidth: 500 }}>
            Upload your photo, pick your style, and click Imagine.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          alignItems: 'start',
        }}>

          {/* ── Left panel: Controls ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Step 1: Upload */}
            <div style={{
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              padding: '1.75rem',
            }}>
              <StepLabel number="01" label="Upload Your Photo" />
              {uploadedImage ? (
                <div style={{ marginTop: '1rem' }}>
                  <img
                    src={originalUrl!}
                    alt="Your uploaded photo"
                    style={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover',
                      display: 'block',
                      border: '1px solid var(--color-border)',
                    }}
                  />
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '0.75rem',
                  }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      Photo uploaded
                    </span>
                    <button
                      onClick={() => { setUploadedImage(null); setResultUrl(null); }}
                      style={{
                        background: 'none',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-muted)',
                        padding: '4px 10px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        transition: 'all var(--transition)',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-accent)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                    >
                      Change
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{
                    border: '2px dashed var(--color-border-light)',
                    padding: '2rem',
                    textAlign: 'center',
                    marginBottom: '1rem',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.9rem',
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.5 }}>⬆</div>
                    A clear, well-lit selfie works best
                  </div>
                  <UploadWidget
                    onUploadSuccess={handleUploadSuccess}
                    onUploadError={handleUploadError}
                    buttonText="Upload Photo"
                    className="hairrison-upload-btn"
                  />
                </div>
              )}
            </div>

            {/* Step 2: Choose style */}
            <div style={{
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              padding: '1.75rem',
            }}>
              <StepLabel number="02" label="Choose Your Style" />

              {/* Mode tabs */}
              <div style={{
                display: 'flex',
                borderBottom: '1px solid var(--color-border)',
                marginTop: '1rem',
                marginBottom: '1.25rem',
              }}>
                {(['preset', 'description'] as StyleInputMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: 'none',
                      border: 'none',
                      borderBottom: mode === m ? '2px solid var(--color-accent)' : '2px solid transparent',
                      color: mode === m ? 'var(--color-text)' : 'var(--color-text-muted)',
                      fontFamily: 'var(--font-display)',
                      fontWeight: mode === m ? 600 : 400,
                      fontSize: '0.85rem',
                      letterSpacing: '0.08em',
                      textTransform: 'capitalize',
                      cursor: 'pointer',
                      transition: 'all var(--transition)',
                      marginBottom: -1,
                    }}
                  >
                    {m === 'preset' ? 'Preset Styles' : 'Describe It'}
                  </button>
                ))}
              </div>

              {mode === 'preset' ? (
                <>
                  {/* Feeling lucky */}
                  <button
                    onClick={handleFeelingLucky}
                    style={{
                      width: '100%',
                      padding: '10px',
                      marginBottom: '1rem',
                      background: 'var(--color-surface-2)',
                      border: '1px solid var(--color-border-light)',
                      color: 'var(--color-text-2)',
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      cursor: 'pointer',
                      transition: 'all var(--transition)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-text)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border-light)'; e.currentTarget.style.color = 'var(--color-text-2)'; }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>✦</span>
                    I'm Feeling Lucky
                  </button>

                  {/* Preset grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '0.75rem',
                  }}>
                    {PRESET_HAIRSTYLES.map((style) => (
                      <PresetCard
                        key={style.id}
                        style={style}
                        isActive={activePreset?.id === style.id}
                        onSelect={() => setActivePreset(style)}
                      />
                    ))}
                  </div>

                  <button
                    onClick={onGoToMarketplace}
                    style={{
                      marginTop: '1rem',
                      width: '100%',
                      padding: '10px',
                      background: 'none',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-muted)',
                      fontSize: '0.85rem',
                      letterSpacing: '0.06em',
                      cursor: 'pointer',
                      transition: 'all var(--transition)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-accent)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                  >
                    Browse 12+ more in Marketplace →
                  </button>
                </>
              ) : (
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    color: 'var(--color-text-muted)',
                    letterSpacing: '0.06em',
                    marginBottom: '0.6rem',
                  }}>
                    Describe your dream hairstyle
                  </label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="e.g. voluminous wavy auburn hair with curtain bangs..."
                    maxLength={200}
                    rows={4}
                    style={{
                      width: '100%',
                      background: 'var(--color-surface-2)',
                      border: '1px solid var(--color-border-light)',
                      color: 'var(--color-text)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '1rem',
                      padding: '0.875rem 1rem',
                      resize: 'vertical',
                      outline: 'none',
                      transition: 'border-color var(--transition)',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--color-accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--color-border-light)'}
                  />
                  <div style={{
                    textAlign: 'right',
                    fontSize: '0.8rem',
                    color: 'var(--color-text-muted)',
                    marginTop: '4px',
                  }}>
                    {description.length}/200
                  </div>
                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-text-muted)',
                    marginTop: '0.75rem',
                    lineHeight: 1.5,
                  }}>
                    Be specific: include length, texture, colour, and any features like bangs or layers.
                  </p>
                </div>
              )}
            </div>

            {/* Step 3: Imagine */}
            <div>
              {transformError && (
                transformError === 'ADDON_REQUIRED' ? (
                  <div style={{
                    border: '1px solid rgba(200,17,43,0.4)',
                    background: 'rgba(200,17,43,0.07)',
                    padding: '1.25rem 1.5rem',
                    marginBottom: '1rem',
                    lineHeight: 1.6,
                  }}>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      color: '#ff6b6b',
                      letterSpacing: '0.04em',
                      marginBottom: '0.75rem',
                    }}>
                      Generative AI Add-on Required
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                      The hair transformation requires the Cloudinary Generative AI add-on. Enable it in 3 steps:
                    </p>
                    <ol style={{
                      fontSize: '0.85rem',
                      color: 'var(--color-text-muted)',
                      paddingLeft: '1.25rem',
                      margin: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                    }}>
                      <li>Go to <strong style={{ color: 'var(--color-text-2)' }}>console.cloudinary.com</strong> → Add-ons</li>
                      <li>Find <strong style={{ color: 'var(--color-text-2)' }}>Cloudinary AI / Generative Replace</strong> and click <strong style={{ color: 'var(--color-text-2)' }}>Subscribe</strong> (free tier available)</li>
                      <li>Return here and click <strong style={{ color: 'var(--color-text-2)' }}>✦ Imagine</strong> again</li>
                    </ol>
                  </div>
                ) : (
                  <div style={{
                    border: '1px solid rgba(200,17,43,0.4)',
                    background: 'rgba(200,17,43,0.07)',
                    padding: '1rem',
                    marginBottom: '1rem',
                    fontSize: '0.9rem',
                    color: '#ff6b6b',
                    lineHeight: 1.5,
                  }}>
                    {transformError}
                  </div>
                )
              )}
              <button
                onClick={handleImagine}
                disabled={isTransforming || !uploadedImage}
                style={{
                  width: '100%',
                  padding: '18px',
                  background: isTransforming || !uploadedImage ? 'var(--color-surface-3)' : 'var(--color-accent)',
                  border: 'none',
                  color: isTransforming || !uploadedImage ? 'var(--color-text-muted)' : '#fff',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: isTransforming || !uploadedImage ? 'not-allowed' : 'pointer',
                  transition: 'all var(--transition)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                }}
                onMouseEnter={e => {
                  if (!isTransforming && uploadedImage) {
                    e.currentTarget.style.background = 'var(--color-accent-hover)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isTransforming && uploadedImage) {
                    e.currentTarget.style.background = 'var(--color-accent)';
                  }
                }}
              >
                {isTransforming && (
                  <span style={{
                    width: 18,
                    height: 18,
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                )}
                {isTransforming ? 'Transforming...' : '✦ Imagine'}
              </button>
              {!uploadedImage && (
                <p style={{
                  textAlign: 'center',
                  fontSize: '0.8rem',
                  color: 'var(--color-text-muted)',
                  marginTop: '0.5rem',
                }}>
                  Upload your photo to get started
                </p>
              )}
              {isTransforming && (
                <p style={{
                  textAlign: 'center',
                  fontSize: '0.85rem',
                  color: 'var(--color-text-muted)',
                  marginTop: '0.75rem',
                  animation: 'pulse 2s infinite',
                }}>
                  Cloudinary AI is working its magic — this may take 10–30 seconds
                </p>
              )}
            </div>
          </div>

          {/* ── Right panel: Result ── */}
          <div>
            <div style={{
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              overflow: 'hidden',
              minHeight: 480,
              display: 'flex',
              flexDirection: 'column',
            }}>
              {/* Header */}
              <div style={{
                padding: '1.25rem 1.75rem',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-2)',
                }}>
                  Result Preview
                </span>
                {resultUrl && (
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      onClick={() => setShowComparison(!showComparison)}
                      style={{
                        background: 'none',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-muted)',
                        padding: '5px 12px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        transition: 'all var(--transition)',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-accent)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                    >
                      {showComparison ? 'Result Only' : 'Compare'}
                    </button>
                    <button
                      onClick={handleDownload}
                      style={{
                        background: 'var(--color-accent)',
                        border: 'none',
                        color: '#fff',
                        padding: '5px 14px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        transition: 'background var(--transition)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--color-accent-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--color-accent)'}
                    >
                      Download
                    </button>
                  </div>
                )}
              </div>

              {/* Image area */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
                {isTransforming ? (
                  <div style={{ textAlign: 'center' }}>
                    <div className="skeleton" style={{ width: 300, height: 360, marginBottom: '1rem' }} />
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', animation: 'pulse 2s infinite' }}>
                      Processing transformation...
                    </p>
                  </div>
                ) : resultUrl ? (
                  showComparison && originalUrl ? (
                    <div style={{ width: '100%' }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1rem',
                      }}>
                        <div>
                          <div style={{
                            fontSize: '0.75rem',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: 'var(--color-text-muted)',
                            marginBottom: '0.5rem',
                            textAlign: 'center',
                          }}>Before</div>
                          <img
                            src={originalUrl}
                            alt="Original"
                            style={{ width: '100%', display: 'block' }}
                          />
                        </div>
                        <div>
                          <div style={{
                            fontSize: '0.75rem',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: 'var(--color-accent)',
                            marginBottom: '0.5rem',
                            textAlign: 'center',
                          }}>After</div>
                          <img
                            ref={imgRef}
                            src={resultUrl}
                            alt="Transformed hairstyle"
                            style={{ width: '100%', display: 'block' }}
                          />
                        </div>
                      </div>
                      {activePreset && (
                        <div style={{
                          textAlign: 'center',
                          marginTop: '1rem',
                          fontFamily: 'var(--font-display)',
                          fontStyle: 'italic',
                          color: 'var(--color-accent)',
                          fontSize: '1.1rem',
                        }}>
                          {activePreset.name}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ width: '100%', textAlign: 'center' }}>
                      <img
                        ref={imgRef}
                        src={resultUrl}
                        alt="Your transformed hairstyle"
                        style={{
                          width: '100%',
                          maxHeight: 520,
                          objectFit: 'contain',
                          display: 'block',
                        }}
                        className="fade-up"
                      />
                      {(activePreset || description) && (
                        <div style={{
                          marginTop: '1rem',
                          fontFamily: 'var(--font-display)',
                          fontStyle: 'italic',
                          color: 'var(--color-accent)',
                          fontSize: '1.1rem',
                        }}>
                          {activePreset?.name ?? `"${description.slice(0, 40)}${description.length > 40 ? '...' : ''}"`}
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{
                      width: 80,
                      height: 80,
                      margin: '0 auto 1.5rem',
                      border: '1px solid var(--color-border-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      color: 'var(--color-text-muted)',
                    }}>✦</div>
                    <h3 style={{ fontWeight: 500, marginBottom: '0.5rem', color: 'var(--color-text-2)' }}>
                      Your transformation<br />will appear here
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                      Upload a photo and select a style to begin
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Active style info */}
            {activePreset && mode === 'preset' && (
              <div style={{
                marginTop: '1rem',
                padding: '1.25rem 1.5rem',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
              className="fade-up"
              >
                <div style={{
                  width: 48,
                  height: 48,
                  background: `linear-gradient(135deg, ${activePreset.gradient[0]}, ${activePreset.gradient[1]})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  color: 'rgba(255,255,255,0.7)',
                  flexShrink: 0,
                }}>
                  {activePreset.icon}
                </div>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: 'var(--color-text)',
                  }}>
                    {activePreset.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                    {activePreset.tagline}
                  </div>
                </div>
                <div style={{
                  marginLeft: 'auto',
                  display: 'flex',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-end',
                }}>
                  {activePreset.tags.slice(0, 3).map(tag => (
                    <span key={tag} style={{
                      fontSize: '0.7rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-muted)',
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepLabel({ number, label }: { number: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.5rem',
        fontWeight: 900,
        color: 'var(--color-accent)',
        opacity: 0.6,
        lineHeight: 1,
      }}>
        {number}
      </span>
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '1rem',
        letterSpacing: '0.02em',
        color: 'var(--color-text)',
      }}>
        {label}
      </h3>
    </div>
  );
}

function PresetCard({
  style,
  isActive,
  onSelect,
}: {
  style: Hairstyle;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      style={{
        background: isActive
          ? `linear-gradient(135deg, ${style.gradient[0]}, ${style.gradient[1]})`
          : 'var(--color-surface-2)',
        border: isActive ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
        padding: '1rem',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all var(--transition)',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        if (!isActive) {
          e.currentTarget.style.borderColor = 'var(--color-border-light)';
          e.currentTarget.style.background = 'var(--color-surface-3)';
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          e.currentTarget.style.borderColor = 'var(--color-border)';
          e.currentTarget.style.background = 'var(--color-surface-2)';
        }
      }}
    >
      {isActive && (
        <div style={{
          position: 'absolute',
          top: 6,
          right: 8,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'var(--color-accent)',
        }} />
      )}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '0.9rem',
        color: isActive ? 'var(--color-white)' : 'var(--color-text)',
        marginBottom: '2px',
      }}>
        {style.icon} {style.name}
      </div>
      <div style={{
        fontSize: '0.75rem',
        color: isActive ? 'rgba(255,255,255,0.65)' : 'var(--color-text-muted)',
        letterSpacing: '0.03em',
      }}>
        {style.tagline}
      </div>
    </button>
  );
}
