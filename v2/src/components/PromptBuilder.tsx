import { useEffect, useMemo, useState } from 'react';
import {
  LENGTH_MODS,
  TEXTURE_MODS,
  COLOR_MODS,
  VIBE_MODS,
  composePrompt,
} from '../data/looks';
import type { Modifier } from '../data/looks';

interface Props {
  onPromptChange: (prompt: string) => void;
}

function ChipRow({
  title,
  mods,
  selected,
  onSelect,
}: {
  title: string;
  mods: Modifier[];
  selected: Modifier | null;
  onSelect: (m: Modifier | null) => void;
}) {
  return (
    <div className="chip-row">
      <span className="chip-row-label">{title}</span>
      <div className="chip-row-chips">
        {mods.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`chip ${selected?.id === m.id ? 'chip-active' : ''}`}
            onClick={() => onSelect(selected?.id === m.id ? null : m)}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PromptBuilder({ onPromptChange }: Props) {
  const [base, setBase] = useState('');
  const [length, setLength] = useState<Modifier | null>(null);
  const [texture, setTexture] = useState<Modifier | null>(null);
  const [color, setColor] = useState<Modifier | null>(null);
  const [vibe, setVibe] = useState<Modifier | null>(null);

  const compiled = useMemo(
    () => composePrompt({ base, length, texture, color, vibe }),
    [base, length, texture, color, vibe]
  );

  // Push compiled prompt up whenever it changes
  useEffect(() => {
    const hasSelection = base.trim() || length || texture || color || vibe;
    onPromptChange(hasSelection ? compiled : '');
  }, [compiled, base, length, texture, color, vibe, onPromptChange]);

  return (
    <div className="prompt-builder">
      <label className="field-label" htmlFor="base-prompt">
        Describe it (optional)
      </label>
      <input
        id="base-prompt"
        className="text-input"
        type="text"
        placeholder="e.g. shaggy mullet with micro bangs"
        value={base}
        onChange={(e) => setBase(e.target.value)}
        maxLength={140}
      />
      <ChipRow title="Length" mods={LENGTH_MODS} selected={length} onSelect={setLength} />
      <ChipRow title="Texture" mods={TEXTURE_MODS} selected={texture} onSelect={setTexture} />
      <ChipRow title="Color" mods={COLOR_MODS} selected={color} onSelect={setColor} />
      <ChipRow title="Vibe" mods={VIBE_MODS} selected={vibe} onSelect={setVibe} />
      {compiled && (base.trim() || length || texture || color || vibe) ? (
        <p className="prompt-preview">
          <span>Prompt:</span> {compiled}
        </p>
      ) : null}
    </div>
  );
}
