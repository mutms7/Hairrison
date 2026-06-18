import { useMemo, useState } from 'react';
import {
  HAIRSTYLES,
  ALL_GENDERS,
  ALL_LENGTHS,
  ALL_TEXTURES,
  styleImage,
} from '../data/looks';
import type { Gender, Hairstyle } from '../data/looks';

interface Props {
  onTry: (style: Hairstyle) => void;
  busyId: string | null;
  /** True once the free preset try is spent and the user isn't unlimited. */
  locked: boolean;
}

export function LooksLibrary({ onTry, busyId, locked }: Props) {
  const [gender, setGender] = useState<Gender>('Women');
  const [length, setLength] = useState<string>('All');
  const [texture, setTexture] = useState<string>('All');

  const filtered = useMemo(
    () =>
      HAIRSTYLES.filter(
        (h) =>
          h.gender === gender &&
          (length === 'All' || h.length === length) &&
          (texture === 'All' || h.texture === texture)
      ),
    [gender, length, texture]
  );

  return (
    <div className="looks-library">
      {/* Gender: the top-level tabs */}
      <div className="gender-tabs" role="tablist" aria-label="Browse by">
        {ALL_GENDERS.map((g) => (
          <button
            key={g}
            role="tab"
            aria-selected={gender === g}
            className={`gender-tab ${gender === g ? 'gender-tab-active' : ''}`}
            onClick={() => setGender(g)}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Length + texture refinements */}
      <div className="looks-filters">
        <div className="looks-filter-row">
          <span className="filter-label">Length</span>
          {['All', ...ALL_LENGTHS].map((l) => (
            <button
              key={l}
              className={`chip ${length === l ? 'chip-active' : ''}`}
              onClick={() => setLength(l)}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="looks-filter-row">
          <span className="filter-label">Texture</span>
          {['All', ...ALL_TEXTURES].map((t) => (
            <button
              key={t}
              className={`chip ${texture === t ? 'chip-active' : ''}`}
              onClick={() => setTexture(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="looks-gallery">
        {filtered.map((h) => {
          const busy = busyId === h.id;
          return (
            <figure key={h.id} className="gallery-card">
              <div className="gallery-photo">
                <img src={styleImage(h.image)} alt={h.name} loading="lazy" />
                {h.trending && <span className="gallery-trend">Trending</span>}
                <button
                  className="gallery-try"
                  onClick={() => onTry(h)}
                  disabled={busy}
                >
                  {busy ? 'Generating…' : locked ? 'Try it · $1.99' : 'Try this look'}
                </button>
              </div>
              <figcaption className="gallery-caption">
                <span className="gallery-name">{h.name}</span>
                <span className="gallery-tagline">{h.tagline}</span>
              </figcaption>
            </figure>
          );
        })}
        {filtered.length === 0 && (
          <p className="empty-text">
            No looks in this combination yet. Try a different filter, or build your own above.
          </p>
        )}
      </div>
    </div>
  );
}
