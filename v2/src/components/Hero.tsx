interface HeroProps {
  onStart: () => void;
}

export function Hero({ onStart }: HeroProps) {
  return (
    <header className="hero">
      <p className="hero-eyebrow">Hairrison Studio · est. 2026</p>
      <h1 className="hero-title">
        Try the haircut
        <br />
        <em>before</em> the haircut.
      </h1>
      <p className="hero-sub">
        Upload a selfie, pick a look, and see yourself in it, powered by Cloudinary
        generative AI. Your first look is free. Unlimited looks are $1.99, once, forever.
      </p>
      <div className="hero-actions">
        <button className="btn btn-primary" onClick={onStart}>
          Try your first look free
        </button>
      </div>
      <div className="hero-rule" aria-hidden>
        <span>✂</span>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <p>
        Hairrison Studio, built by William Chenyin. Engine: Cloudinary Generative Replace.
        Payments: Stripe. Support: chenyinwilliam@gmail.com
      </p>
    </footer>
  );
}
