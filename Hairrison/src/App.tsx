import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { HairTool } from './components/HairTool';
import { Marketplace } from './components/Marketplace';
import type { Hairstyle } from './data/hairstyles';
import './App.css';

type View = 'home' | 'tool' | 'marketplace';

function App() {
  const [view, setView] = useState<View>('home');
  const [pendingStyle, setPendingStyle] = useState<Hairstyle | null>(null);

  const handleNavigate = (nextView: View) => {
    setView(nextView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTryStyle = (style: Hairstyle) => {
    setPendingStyle(style);
    handleNavigate('tool');
  };

  const handleClearPendingStyle = () => {
    setPendingStyle(null);
  };

  return (
    <div className="app">
      <Navigation currentView={view} onNavigate={handleNavigate} />

      <main>
        {view === 'home' && (
          <Hero onNavigate={handleNavigate} />
        )}
        {view === 'tool' && (
          <HairTool
            onGoToMarketplace={() => handleNavigate('marketplace')}
            selectedStyle={pendingStyle}
            onClearSelectedStyle={handleClearPendingStyle}
          />
        )}
        {view === 'marketplace' && (
          <Marketplace onTryStyle={handleTryStyle} />
        )}
      </main>

      <footer style={{
        borderTop: '1px solid var(--color-border)',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            display: 'inline-block',
            width: 20,
            height: 20,
            background: 'var(--color-accent)',
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }} />
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            Hairrison
          </span>
        </div>
        <p style={{
          fontSize: '0.8rem',
          color: 'var(--color-text-muted)',
          letterSpacing: '0.05em',
        }}>
          Powered by Cloudinary Generative AI. Results may vary based on photo quality.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {(['Home', 'Try It', 'Marketplace'] as const).map((label, i) => {
            const views: View[] = ['home', 'tool', 'marketplace'];
            return (
              <button
                key={label}
                onClick={() => handleNavigate(views[i])}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  fontSize: '0.8rem',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  padding: 0,
                  transition: 'color var(--transition)',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
              >
                {label}
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
}

export default App;
