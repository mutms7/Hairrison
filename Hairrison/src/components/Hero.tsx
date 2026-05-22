type View = 'home' | 'tool' | 'marketplace';

interface HeroProps {
  onNavigate: (view: View) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  return (
    <section
      className="wave-bg"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 2rem 80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,212,170,0.07) 0%, rgba(4,30,53,0.4) 50%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Deep ocean depth gradient */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(4,30,53,0.6) 0%, transparent 40%, rgba(4,30,53,0.3) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Decorative lines */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)',
      }} />

      {/* Eyebrow */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '2rem',
        animation: 'fadeUp 0.6s ease forwards',
        position: 'relative',
      }}>
        <div style={{ height: 1, width: 40, background: 'var(--color-accent)' }} />
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'var(--color-accent)',
        }}>
          AI-Powered Hair Visualisation
        </span>
        <div style={{ height: 1, width: 40, background: 'var(--color-accent)' }} />
      </div>

      {/* Main headline */}
      <h1 style={{
        fontSize: 'clamp(3.5rem, 9vw, 8rem)',
        fontWeight: 900,
        textAlign: 'center',
        letterSpacing: '-0.02em',
        lineHeight: 1.0,
        marginBottom: '0.2em',
        animation: 'fadeUp 0.6s 0.1s ease both',
        position: 'relative',
      }}>
        Your Hair,
      </h1>
      <h1 style={{
        fontSize: 'clamp(3.5rem, 9vw, 8rem)',
        fontWeight: 900,
        fontStyle: 'italic',
        textAlign: 'center',
        letterSpacing: '-0.02em',
        lineHeight: 1.0,
        marginBottom: '1.5rem',
        animation: 'fadeUp 0.6s 0.2s ease both',
        color: 'var(--color-accent)',
        position: 'relative',
      }}>
        Reimagined.
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)',
        textAlign: 'center',
        maxWidth: 560,
        marginBottom: '3rem',
        fontWeight: 300,
        letterSpacing: '0.02em',
        color: 'var(--color-text-2)',
        animation: 'fadeUp 0.6s 0.3s ease both',
        position: 'relative',
      }}>
        Upload your photo, choose a hairstyle — and see yourself transformed in seconds.
        Browse presets, explore the marketplace, or describe your dream look.
      </p>

      {/* CTAs */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        animation: 'fadeUp 0.6s 0.4s ease both',
        position: 'relative',
      }}>
        <button
          onClick={() => onNavigate('tool')}
          style={{
            padding: '16px 40px',
            background: 'var(--color-accent)',
            border: 'none',
            color: '#041e35',
            fontFamily: 'var(--font-display)',
            fontSize: '1rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all var(--transition)',
            boxShadow: 'var(--shadow-accent)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--color-accent-hover)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'var(--color-accent)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Try It Free
        </button>
        <button
          onClick={() => onNavigate('marketplace')}
          style={{
            padding: '16px 40px',
            background: 'transparent',
            border: '1px solid var(--color-border-light)',
            color: 'var(--color-text)',
            fontFamily: 'var(--font-display)',
            fontSize: '1rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all var(--transition)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--color-accent)';
            e.currentTarget.style.color = 'var(--color-accent)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--color-border-light)';
            e.currentTarget.style.color = 'var(--color-text)';
          }}
        >
          Browse Styles
        </button>
      </div>

      {/* Stats strip */}
      <div style={{
        display: 'flex',
        gap: '3rem',
        marginTop: '5rem',
        borderTop: '1px solid var(--color-border)',
        paddingTop: '2.5rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        animation: 'fadeUp 0.6s 0.5s ease both',
        position: 'relative',
      }}>
        {[
          { number: '26+', label: 'Curated Styles' },
          { number: 'AI', label: 'Powered Transform' },
          { number: '∞', label: 'Custom Descriptions' },
        ].map(({ number, label }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.2rem',
              fontWeight: 900,
              color: 'var(--color-text)',
              letterSpacing: '-0.02em',
            }}>{number}</div>
            <div style={{
              fontSize: '0.8rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              marginTop: '4px',
            }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        animation: 'pulse 2s ease-in-out infinite',
        opacity: 0.5,
      }}>
        <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
          Scroll
        </span>
        <div style={{ width: 1, height: 32, background: 'var(--color-text-muted)' }} />
      </div>

      {/* How it works section */}
      <div style={{ marginTop: '6rem', width: '100%', maxWidth: 960, animation: 'fadeUp 0.6s 0.6s ease both', position: 'relative' }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
          marginBottom: '3rem',
          letterSpacing: '-0.01em',
        }}>
          How It Works
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1px',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
        }}>
          {[
            { step: '01', title: 'Upload Your Photo', desc: 'Take a selfie or upload any clear photo of yourself.' },
            { step: '02', title: 'Choose a Style', desc: 'Pick from curated presets, marketplace styles, or describe your own.' },
            { step: '03', title: 'Imagine Yourself', desc: 'Cloudinary AI reimagines your hair in seconds.' },
            { step: '04', title: 'Save & Share', desc: 'Download your transformation or share it directly.' },
          ].map(({ step, title, desc }) => (
            <div
              key={step}
              style={{
                padding: '2.5rem 2rem',
                background: 'var(--color-surface)',
                borderRight: '1px solid var(--color-border)',
                transition: 'background var(--transition)',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-surface)')}
            >
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '3rem',
                fontWeight: 900,
                color: 'var(--color-accent)',
                opacity: 0.5,
                lineHeight: 1,
                marginBottom: '1rem',
              }}>{step}</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{title}</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Demo section */}
      <div style={{ marginTop: '6rem', width: '100%', maxWidth: 960, animation: 'fadeUp 0.6s 0.7s ease both', position: 'relative' }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
          marginBottom: '0.75rem',
          letterSpacing: '-0.01em',
        }}>
          See the{' '}
          <span style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>Magic</span>
        </h2>
        <p style={{
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          marginBottom: '3rem',
          fontSize: '1rem',
          letterSpacing: '0.02em',
        }}>
          Three simple steps to your new look
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
        }}>
          {/* Card 1 — Upload */}
          <div style={{
            background: 'linear-gradient(145deg, #062444, #083058)',
            border: '1px solid var(--color-border)',
            borderRadius: '2px',
            padding: '2.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            transition: 'border-color var(--transition), transform var(--transition)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--color-accent)';
            e.currentTarget.style.transform = 'translateY(-4px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1.25rem', lineHeight: 1 }}>📸</div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
              marginBottom: '0.5rem',
            }}>Step 01</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--color-text)' }}>
              Upload Your Photo
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              Drop in a selfie or any clear front-facing photo. The AI handles the rest — no studio required.
            </p>
          </div>

          {/* Card 2 — Choose */}
          <div style={{
            background: 'linear-gradient(145deg, #062444, #083058)',
            border: '1px solid var(--color-border)',
            borderRadius: '2px',
            padding: '2.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            transition: 'border-color var(--transition), transform var(--transition)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--color-accent)';
            e.currentTarget.style.transform = 'translateY(-4px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1.25rem', lineHeight: 1 }}>✂️</div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
              marginBottom: '0.5rem',
            }}>Step 02</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--color-text)' }}>
              Choose a Style
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Browse 26+ curated styles or type your own description.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {['Wolf Cut', 'Beach Waves', 'Buzz Cut'].map(style => (
                <span key={style} style={{
                  fontSize: '0.72rem',
                  letterSpacing: '0.06em',
                  padding: '4px 12px',
                  background: 'rgba(0,212,170,0.1)',
                  border: '1px solid rgba(0,212,170,0.3)',
                  color: 'var(--color-accent)',
                  borderRadius: '2px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                }}>
                  {style}
                </span>
              ))}
            </div>
          </div>

          {/* Card 3 — Result */}
          <div style={{
            background: 'linear-gradient(145deg, #062444, #083058)',
            border: '1px solid var(--color-border)',
            borderRadius: '2px',
            padding: '2.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            transition: 'border-color var(--transition), transform var(--transition)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--color-accent)';
            e.currentTarget.style.transform = 'translateY(-4px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1.25rem', lineHeight: 1 }}>✨</div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
              marginBottom: '0.5rem',
            }}>Step 03</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--color-text)' }}>
              Get Your Result
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Cloudinary AI transforms your photo in ~15 seconds. Compare before and after, then download.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
              <div style={{
                flex: 1,
                height: 52,
                background: 'linear-gradient(135deg, #062444, #0a3a6b)',
                border: '1px solid var(--color-border)',
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
              }}>
                Before
              </div>
              <div style={{
                flex: 1,
                height: 52,
                background: 'linear-gradient(135deg, rgba(0,212,170,0.15), rgba(0,184,148,0.25))',
                border: '1px solid rgba(0,212,170,0.4)',
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
              }}>
                After ✦
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
