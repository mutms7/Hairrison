import { MirrorCompare } from './MirrorCompare';
import { useState } from 'react';
import type { LookRecord } from '../lib/history';

interface Props {
  records: LookRecord[];
  onClear: () => void;
}

export function HistoryRail({ records, onClear }: Props) {
  const [open, setOpen] = useState<LookRecord | null>(null);

  if (records.length === 0) return null;

  return (
    <section className="history" id="history">
      <div className="history-header">
        <span className="eyebrow">Your session</span>
        <h2>Looks you've tried</h2>
        <button className="btn btn-ghost" onClick={onClear}>
          Clear history
        </button>
      </div>
      <div className="history-rail">
        {records.map((r) => (
          <button key={r.id} className="history-card" onClick={() => setOpen(r)}>
            <img src={r.afterUrl} alt={`${r.label} preview`} loading="lazy" />
            <span>{r.label}</span>
          </button>
        ))}
      </div>
      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(null)}>
          <div className="history-modal" onClick={(e) => e.stopPropagation()}>
            <button className="paywall-close" onClick={() => setOpen(null)} aria-label="Close">
              ✕
            </button>
            <h3>{open.label}</h3>
            <MirrorCompare beforeUrl={open.beforeUrl} afterUrl={open.afterUrl} afterLabel={open.label} />
          </div>
        </div>
      )}
    </section>
  );
}
