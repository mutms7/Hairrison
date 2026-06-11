import { useCallback, useRef, useState } from 'react';

interface Props {
  beforeUrl: string;
  afterUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
}

/**
 * MirrorCompare — draggable before/after reveal, framed like a salon mirror.
 */
export function MirrorCompare({
  beforeUrl,
  afterUrl,
  beforeLabel = 'Now',
  afterLabel = 'After',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging.current) updateFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setPosition((p) => Math.max(0, p - 4));
    if (e.key === 'ArrowRight') setPosition((p) => Math.min(100, p + 4));
  };

  return (
    <div
      ref={containerRef}
      className="mirror-compare"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      role="slider"
      aria-label="Before and after comparison"
      aria-valuenow={Math.round(position)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <img className="mirror-img" src={afterUrl} alt="After: new hairstyle preview" draggable={false} />
      <div className="mirror-before" style={{ width: `${position}%` }}>
        <img
          className="mirror-img"
          src={beforeUrl}
          alt="Before: original photo"
          draggable={false}
          style={{ width: containerRef.current ? containerRef.current.offsetWidth : undefined }}
        />
      </div>
      <div className="mirror-handle" style={{ left: `${position}%` }}>
        <span className="mirror-handle-grip">⟷</span>
      </div>
      <span className="mirror-tag mirror-tag-left">{beforeLabel}</span>
      <span className="mirror-tag mirror-tag-right">{afterLabel}</span>
    </div>
  );
}
