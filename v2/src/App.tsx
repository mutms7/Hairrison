import { useCallback, useEffect, useState } from 'react';
import { Hero, Footer } from './components/Hero';
import { Studio } from './components/Studio';
import { HistoryRail } from './components/HistoryRail';
import { Paywall } from './components/Paywall';
import { handleCheckoutReturn, hasUnlimited, freeCreditsRemaining } from './lib/entitlements';
import { getHistory, clearHistory } from './lib/history';
import type { LookRecord } from './lib/history';

export default function App() {
  const [records, setRecords] = useState<LookRecord[]>(() => getHistory());
  const [purchaseState, setPurchaseState] = useState<'none' | 'success' | 'failed'>('none');

  // Finalize Stripe checkout if we just got redirected back
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.get('session_id')) return;
    handleCheckoutReturn().then((license) => {
      setPurchaseState(license ? 'success' : 'failed');
    });
  }, []);

  const scrollToStudio = useCallback(() => {
    document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const onClearHistory = useCallback(() => {
    clearHistory();
    setRecords([]);
  }, []);

  return (
    <div className="app">
      <Hero onStart={scrollToStudio} />

      {purchaseState === 'success' && (
        <div className="banner banner-success">
          Payment confirmed — unlimited looks are yours. A receipt is on its way to your email.
        </div>
      )}
      {purchaseState === 'failed' && (
        <div className="banner banner-error">
          We couldn't confirm that payment. If you were charged, email chenyinwilliam@gmail.com
          and we'll sort it out.
        </div>
      )}

      <Studio onHistoryChange={setRecords} />

      <HistoryRail records={records} onClear={onClearHistory} />

      <section className="pricing-strip">
        <Paywall freeRemaining={freeCreditsRemaining()} unlimited={hasUnlimited()} />
      </section>

      <Footer />
    </div>
  );
}
