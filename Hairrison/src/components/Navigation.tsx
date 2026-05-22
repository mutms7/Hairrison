import { useState, useEffect } from 'react';

type View = 'home' | 'tool' | 'marketplace';

interface NavigationProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

export function Navigation({ currentView, onNavigate }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLinks: { label: string; view: View }[] = [
    { label: 'Home', view: 'home' },
    { label: 'Try It', view: 'tool' },
    { label: 'Marketplace', view: 'marketplace' },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--nav-height)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        padding: '0 2rem',
        borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
        background: scrolled
          ? 'rgba(4, 30, 53, 0.95)'
          : 'linear-gradient(180deg, rgba(4,30,53,0.9) 0%, transparent 100%)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'all var(--transition-slow)',
      }}
    >
      {/* Logo */}
      <button
        onClick={() => { onNavigate('home'); setMenuOpen(false); }}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
        }}
      >
        <span style={{
          display: 'inline-block',
          width: 32,
          height: 32,
          background: 'var(--color-accent)',
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          flexShrink: 0,
        }} />
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: '1.4rem',
          letterSpacing: '0.08em',
          color: 'var(--color-text)',
          textTransform: 'uppercase',
        }}>
          Hairrison
        </span>
      </button>

      {/* Desktop nav links */}
      <div style={{
        marginLeft: 'auto',
        display: 'flex',
        gap: '2.5rem',
        alignItems: 'center',
      }}>
        {navLinks.map(({ label, view }) => (
          <button
            key={view}
            onClick={() => onNavigate(view)}
            style={{
              background: 'none',
              border: 'none',
              padding: '4px 0',
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              fontWeight: currentView === view ? 600 : 400,
              letterSpacing: '0.06em',
              color: currentView === view ? 'var(--color-accent)' : 'var(--color-text-2)',
              borderBottom: currentView === view ? '1px solid var(--color-accent)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'color var(--transition), border-color var(--transition)',
            }}
            onMouseEnter={e => {
              if (currentView !== view) e.currentTarget.style.color = 'var(--color-text)';
            }}
            onMouseLeave={e => {
              if (currentView !== view) e.currentTarget.style.color = 'var(--color-text-2)';
            }}
          >
            {label}
          </button>
        ))}

        <button
          onClick={() => onNavigate('tool')}
          style={{
            background: 'var(--color-accent)',
            border: 'none',
            padding: '10px 22px',
            fontFamily: 'var(--font-display)',
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#041e35',
            cursor: 'pointer',
            transition: 'background var(--transition)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-accent-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--color-accent)'}
        >
          Try Now
        </button>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
        style={{
          display: 'none',
          marginLeft: 'auto',
          background: 'none',
          border: 'none',
          color: 'var(--color-text)',
          fontSize: '1.5rem',
          cursor: 'pointer',
        }}
      >
        {menuOpen ? '✕' : '☰'}
      </button>
    </nav>
  );
}
