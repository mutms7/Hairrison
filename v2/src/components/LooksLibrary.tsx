import { useMemo, useState } from 'react';
import { HAIRSTYLES, ALL_CATEGORIES, ALL_GENDERS } from '../data/looks';
import type { Hairstyle } from '../data/looks';

interface Props {
  selectedIds: string[];
  onToggle: (style: Hairstyle) => void;
  maxSelectable: number;
}

export function LooksLibrary({ selectedIds, onToggle, maxSelectable }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [gender, setGender] = useState<string>('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return HAIRSTYLES.filter((h) => {
      if (category !== 'All' && h.category !== category) return false;
      if (gender !== 'All' && h.gender !== gender && h.gender !== 'Unisex') return false;
      if (!q) return true;
      return (
        h.name.toLowerCase().includes(q) ||
        h.tags.some((t) => t.includes(q)) ||
        h.tagline.toLowerCase().includes(q)
      );
    });
  }, [query, category, gender]);

  return (
    <div className="looks-library">
      <div className="looks-filters">
        <input
          className="text-input looks-search"
          type="search"
          placeholder="Search 27 looks…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search looks"
        />
        <div className="looks-filter-row">
          {['All', ...ALL_CATEGORIES].map((c) => (
            <button
              key={c}
              className={`chip ${category === c ? 'chip-active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="looks-filter-row">
          {['All', ...ALL_GENDERS].map((g) => (
            <button
              key={g}
              className={`chip ${gender === g ? 'chip-active' : ''}`}
              onClick={() => setGender(g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="looks-grid">
        {filtered.map((h) => {
          const isSelected = selectedIds.includes(h.id);
          const atCap = !isSelected && selectedIds.length >= maxSelectable;
          return (
            <button
              key={h.id}
              className={`look-card ${isSelected ? 'look-card-selected' : ''}`}
              style={{
                background: `linear-gradient(145deg, ${h.gradient[0]}, ${h.gradient[1]})`,
              }}
              onClick={() => !atCap && onToggle(h)}
              disabled={atCap}
              aria-pressed={isSelected}
            >
              <span className="look-icon" aria-hidden>
                {h.icon}
              </span>
              <span className="look-name">{h.name}</span>
              <span className="look-tagline">{h.tagline}</span>
              {h.trending && <span className="look-trend">Trending</span>}
              {isSelected && <span className="look-check">✓</span>}
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="empty-text">No looks match. Try a different search or build a custom prompt below.</p>
        )}
      </div>
    </div>
  );
}
