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
        Upload a selfie, describe any look you can dream up, and see yourself in it,
        powered by Cloudinary generative AI. Your first custom look and first preset are
        free. Unlimited is $1.99, once, forever.
      </p>
      <div className="hero-actions">
        <button className="btn btn-primary" onClick={onStart}>
          Start with a free look
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
