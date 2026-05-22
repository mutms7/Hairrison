import { useState } from 'react';
import { MARKETPLACE_HAIRSTYLES, ALL_CATEGORIES, ALL_GENDERS } from '../data/hairstyles';
import type { Hairstyle } from '../data/hairstyles';

interface MarketplaceProps {
  onTryStyle: (style: Hairstyle) => void;
}

export function Marketplace({ onTryStyle }: MarketplaceProps) {
  const [activeGender, setActiveGender] = useState<string>('All');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'trending' | 'name'>('trending');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const categories = ['All', ...ALL_CATEGORIES];
  const genders = ['All', ...ALL_GENDERS];

  const filtered = MARKETPLACE_HAIRSTYLES
    .filter(h => activeCategory === 'All' || h.category === activeCategory)
    .filter(h => activeGender === 'All' || h.gender === activeGender)
    .sort((a, b) => {
      if (sortBy === 'trending') {
        if (a.trending && !b.trending) return -1;
        if (!a.trending && b.trending) return 1;
      }
      return a.name.localeCompare(b.name);
    });

  return (
    <section style={{ minHeight: '100vh', padding: '100px 2rem 80px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

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
              Style Marketplace
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', letterSpacing: '-0.02em' }}>
            Browse & Try
          </h1>
          <p style={{ fontSize: '1.1rem', marginTop: '0.5rem', maxWidth: 480 }}>
            18+ styles for every vibe — Women's, Men's & Unisex.
            Pick one and imagine it on yourself.
          </p>
        </div>

        {/* Gender filter tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: '0',
        }}>
          {genders.map(gender => (
            <button
              key={gender}
              onClick={() => setActiveGender(gender)}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderBottom: activeGender === gender ? '2px solid var(--color-accent)' : '2px solid transparent',
                background: 'transparent',
                color: activeGender === gender ? 'var(--color-accent)' : 'var(--color-text-muted)',
                fontFamily: 'var(--font-display)',
                fontWeight: activeGender === gender ? 700 : 500,
                fontSize: '0.95rem',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                transition: 'all var(--transition)',
                marginBottom: '-1px',
              }}
              onMouseEnter={e => {
                if (activeGender !== gender) {
                  e.currentTarget.style.color = 'var(--color-text)';
                }
              }}
              onMouseLeave={e => {
                if (activeGender !== gender) {
                  e.currentTarget.style.color = 'var(--color-text-muted)';
                }
              }}
            >
              {gender === 'All' ? 'All Styles' : gender === 'Women' ? "Women's" : gender === 'Men' ? "Men's" : gender}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: '1.5rem',
        }}>
          {/* Category pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '6px 16px',
                  border: activeCategory === cat ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                  background: activeCategory === cat ? 'var(--color-accent)' : 'transparent',
                  color: activeCategory === cat ? '#041e35' : 'var(--color-text-muted)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all var(--transition)',
                }}
                onMouseEnter={e => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.borderColor = 'var(--color-border-light)';
                    e.currentTarget.style.color = 'var(--color-text)';
                  }
                }}
                onMouseLeave={e => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.color = 'var(--color-text-muted)';
                  }
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', letterSpacing: '0.06em' }}>
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'trending' | 'name')}
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                padding: '6px 12px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="trending">Trending First</option>
              <option value="name">Name (A–Z)</option>
            </select>
          </div>
        </div>

        {/* Trending banner */}
        {activeCategory === 'All' && sortBy === 'trending' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--color-accent)',
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.8rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
            }}>
              Trending Now
            </span>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
          </div>
        )}

        {/* Count */}
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--color-text-muted)',
          marginBottom: '1.5rem',
        }}>
          {filtered.length} style{filtered.length !== 1 ? 's' : ''} found
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>◇</div>
            No styles in this category yet.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1px',
            border: '1px solid var(--color-border)',
            overflow: 'hidden',
          }}>
            {filtered.map((style, idx) => (
              <MarketplaceCard
                key={style.id}
                style={style}
                isHovered={hoveredId === style.id}
                onHover={() => setHoveredId(style.id)}
                onLeave={() => setHoveredId(null)}
                onTry={() => onTryStyle(style)}
                delay={idx * 40}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function MarketplaceCard({
  style,
  isHovered,
  onHover,
  onLeave,
  onTry,
  delay,
}: {
  style: Hairstyle;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onTry: () => void;
  delay: number;
}) {
  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        background: isHovered
          ? `linear-gradient(160deg, ${style.gradient[0]}, ${style.gradient[1]})`
          : 'var(--color-surface)',
        padding: '2rem',
        position: 'relative',
        transition: 'background var(--transition-slow)',
        cursor: 'default',
        animation: `fadeUp 0.5s ${delay}ms ease both`,
        borderRight: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      {/* Trending badge */}
      {style.trending && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'var(--color-accent)',
          color: '#041e35',
          fontSize: '0.65rem',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          padding: '3px 8px',
        }}>
          Hot
        </div>
      )}

      {/* Icon */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '2.5rem',
        marginBottom: '1rem',
        color: isHovered ? 'rgba(255,255,255,0.4)' : 'var(--color-text-muted)',
        lineHeight: 1,
        transition: 'color var(--transition)',
      }}>
        {style.icon}
      </div>

      {/* Category + Gender */}
      <div style={{
        fontSize: '0.7rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: isHovered ? 'rgba(255,255,255,0.5)' : 'var(--color-text-muted)',
        marginBottom: '0.4rem',
        transition: 'color var(--transition)',
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
      }}>
        <span>{style.category}</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <span>{style.gender}</span>
      </div>

      {/* Name */}
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '1.3rem',
        letterSpacing: '-0.01em',
        marginBottom: '0.25rem',
        color: isHovered ? 'var(--color-white)' : 'var(--color-text)',
        transition: 'color var(--transition)',
      }}>
        {style.name}
      </h3>

      {/* Tagline */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontStyle: 'italic',
        fontSize: '0.85rem',
        color: isHovered ? 'rgba(255,255,255,0.6)' : 'var(--color-accent)',
        marginBottom: '0.75rem',
        transition: 'color var(--transition)',
      }}>
        {style.tagline}
      </div>

      {/* Description */}
      <p style={{
        fontSize: '0.9rem',
        lineHeight: 1.55,
        color: isHovered ? 'rgba(255,255,255,0.7)' : 'var(--color-text-muted)',
        marginBottom: '1.25rem',
        transition: 'color var(--transition)',
      }}>
        {style.description}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {style.tags.slice(0, 3).map(tag => (
          <span key={tag} style={{
            fontSize: '0.65rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '3px 8px',
            border: isHovered ? '1px solid rgba(255,255,255,0.2)' : '1px solid var(--color-border)',
            color: isHovered ? 'rgba(255,255,255,0.5)' : 'var(--color-text-muted)',
            transition: 'all var(--transition)',
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={onTry}
        style={{
          width: '100%',
          padding: '11px',
          background: isHovered ? 'rgba(255,255,255,0.12)' : 'transparent',
          border: isHovered ? '1px solid rgba(255,255,255,0.3)' : '1px solid var(--color-border)',
          color: isHovered ? 'var(--color-white)' : 'var(--color-text-muted)',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '0.8rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          transition: 'all var(--transition)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'var(--color-accent)';
          e.currentTarget.style.borderColor = 'var(--color-accent)';
          e.currentTarget.style.color = '#041e35';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = isHovered ? 'rgba(255,255,255,0.12)' : 'transparent';
          e.currentTarget.style.borderColor = isHovered ? 'rgba(255,255,255,0.3)' : 'var(--color-border)';
          e.currentTarget.style.color = isHovered ? 'var(--color-white)' : 'var(--color-text-muted)';
        }}
      >
        ✦ Try This Style
      </button>
    </div>
  );
}
