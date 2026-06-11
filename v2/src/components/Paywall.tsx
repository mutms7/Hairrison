import { useState } from 'react';
import { startCheckout } from '../lib/entitlements';

interface Props {
  freeRemaining: number;
  unlimited: boolean;
  asModal?: boolean;
  onClose?: () => void;
}

export function Paywall({ freeRemaining, unlimited, asModal = false, onClose }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buy = async () => {
    setBusy(true);
    setError(null);
    try {
      await startCheckout();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout failed.');
      setBusy(false);
    }
  };

  if (unlimited) {
    return (
      <div className="paywall paywall-unlocked">
        <span className="paywall-badge">Studio member</span>
        <p>Unlimited looks unlocked. Thank you for supporting Hairrison.</p>
      </div>
    );
  }

  const body = (
    <div className={asModal ? 'paywall paywall-modal' : 'paywall'}>
      {asModal && (
        <button className="paywall-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
      )}
      <p className="paywall-eyebrow">
        {freeRemaining > 0
          ? `${freeRemaining} free look remaining`
          : 'Your free look is used up'}
      </p>
      <h3 className="paywall-title">Unlimited looks — 99¢, once.</h3>
      <p className="paywall-copy">
        One payment, no subscription. Generate as many hairstyles as you want, forever.
        Secure checkout by Stripe; your receipt is emailed to you.
      </p>
      <button className="btn btn-primary" onClick={buy} disabled={busy}>
        {busy ? 'Opening checkout…' : 'Unlock for $0.99'}
      </button>
      {error && <p className="error-text">{error}</p>}
      <p className="paywall-fineprint">
        Questions or refund requests: chenyinwilliam@gmail.com
      </p>
    </div>
  );

  if (asModal) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div onClick={(e) => e.stopPropagation()}>{body}</div>
      </div>
    );
  }
  return body;
}
