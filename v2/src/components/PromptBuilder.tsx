import { useEffect, useMemo, useState } from 'react';
import { LENGTH_MODS, TEXTURE_MODS, COLOR_MODS, composePrompt } from '../data/looks';
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

  const compiled = useMemo(
    () => composePrompt({ base, length, texture, color }),
    [base, length, texture, color]
  );

  // Push the compiled prompt up whenever it changes.
  useEffect(() => {
    onPromptChange(compiled);
  }, [compiled, onPromptChange]);

  // Once you type your own description, the length/texture chips just
  // get in the way, so fade them out (colour still stacks nicely).
  const hasFreeText = base.trim().length > 0;

  return (
    <div className="prompt-builder">
      <label className="builder-big-label" htmlFor="base-prompt">
        Describe any look you want
      </label>
      <input
        id="base-prompt"
        className="text-input builder-big-input"
        type="text"
        placeholder="e.g. shaggy mullet with micro bangs · platinum buzz cut · a rat on my head"
        value={base}
        onChange={(e) => setBase(e.target.value)}
        maxLength={160}
        autoComplete="off"
      />
      <p className="builder-hint">
        Go literal, it generates exactly what you say. Or skip the typing and
        tap the options below.
      </p>

      <div className={hasFreeText ? 'builder-mods builder-mods-dim' : 'builder-mods'}>
        <ChipRow title="Length" mods={LENGTH_MODS} selected={length} onSelect={setLength} />
        <ChipRow title="Texture" mods={TEXTURE_MODS} selected={texture} onSelect={setTexture} />
        <ChipRow title="Color" mods={COLOR_MODS} selected={color} onSelect={setColor} />
      </div>

      {compiled ? (
        <p className="prompt-preview">
          <span>Prompt</span> {compiled}
        </p>
      ) : null}
    </div>
  );
}
