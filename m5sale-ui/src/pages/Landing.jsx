import { Link } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';

const navItems = ['Overview', 'Allocation', 'Utility', 'Vesting', 'FAQ', 'Private Sale', 'Community'];

const ecosystemCards = [
  {
    title: 'M5VF private allocation',
    detail: 'Secure early-stage M5VF access in a controlled ICO private sale round with verified on-chain records.',
  },
  {
    title: 'Institutional-grade sale flow',
    detail: 'Track commitment amounts, vesting windows, and referral performance from one premium investor portal.',
  },
  {
    title: 'Built for the M5DEX ecosystem',
    detail: 'M5VF powers trading incentives, governance participation, and future ecosystem utility unlocks.',
  },
];

const stats = [
  { label: 'Token', value: 'M5VF' },
  { label: 'ICO stage', value: 'Private Sale' },
  { label: 'Accepted assets', value: 'USDT · USDC · BNB' },
  { label: 'Network coverage', value: 'Ethereum · BNB Chain · Tron' },
];

const milestones = [
  { title: 'Phase 01', detail: 'Private sale onboarding and priority allocation confirmations.' },
  { title: 'Phase 02', detail: 'M5VF distribution schedule and dashboard vesting visibility.' },
  { title: 'Phase 03', detail: 'Utility activation for ecosystem products and token conversion flows.' },
  { title: 'Phase 04', detail: 'Community growth, governance expansion, and liquidity milestones.' },
];

const Landing = () => {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref');
  const signUpUrl = ref ? `/sign-up?ref=${ref}` : '/sign-up';
  const signInUrl = ref ? `/sign-in?ref=${ref}` : '/sign-in';

  return (
    <div className="landing landing-dark-home">
      <header className="landing-top-shell">
        <nav className="landing-nav dark-nav">
          <div className="top-nav-links">
            {navItems.map((item, index) => (
              <a key={item} href="#" className={index === 0 ? 'top-nav-link active' : 'top-nav-link'}>
                {item}
              </a>
            ))}
            <a href="#" className="top-nav-link dot-link">
              <span /> Live Sale
            </a>
          </div>

          <SignedOut>
            <div className="landing-nav-actions">
              <Link className="ghost-button" to={signInUrl}>
                Sign in
              </Link>
              <Link className="primary-button gradient-button" to={signUpUrl}>
                Join M5VF Private Sale
              </Link>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="landing-nav-actions">
              <Link className="primary-button gradient-button" to="/dashboard">
                Open Dashboard
              </Link>
            </div>
          </SignedIn>
        </nav>
      </header>

      <main className="landing-fullpage-content">
        <section className="landing-hero dark-hero-center">
          <img className="hero-logo-large" src="https://m5dex.com/images/logo-high-res.png" alt="M5DEX" />
          <h1>
            M5VF Token <span>ICO Private Sale</span>
          </h1>
          <p>
            Experience a premium, dark-first M5DEX private sale journey designed for high-conviction participants.
            Access the M5VF round, monitor progress in real time, and prepare for long-term ecosystem utility.
          </p>
          <h2>Early Access. Structured Vesting. Real Utility.</h2>

          <SignedOut>
            <div className="hero-actions centered-actions">
              <Link className="primary-button gradient-button hero-cta" to={signUpUrl}>
                Reserve Allocation
              </Link>
              <Link className="ghost-button solid-dark" to={signInUrl}>
                Investor Login
              </Link>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="hero-actions centered-actions">
              <Link className="primary-button gradient-button hero-cta" to="/dashboard">
                Continue to Dashboard
              </Link>
            </div>
          </SignedIn>
        </section>

        <section className="landing-section dark-section">
          <div className="section-header single-column">
            <h2>Why M5VF private sale</h2>
            <p>
              A refined ICO experience inspired by the M5DEX design language and tailored for private-round clarity.
            </p>
          </div>
          <div className="feature-grid premium-feature-grid">
            {ecosystemCards.map((item) => (
              <article key={item.title} className="feature-card premium-feature-card">
                <h4>{item.title}</h4>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section dark-section alt-glass">
          <div className="section-header single-column">
            <h2>ICO private sale snapshot</h2>
          </div>
          <div className="tokenomics-grid">
            {stats.map((item) => (
              <article key={item.label} className="tokenomic-card dark-tokenomic">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section dark-section">
          <div className="section-header single-column">
            <h2>M5VF rollout timeline</h2>
            <p>Roadmap focused on staged delivery, token utility, and transparent participant updates.</p>
          </div>
          <div className="flow-grid premium-flow-grid roadmap-grid">
            {milestones.map((item) => (
              <article key={item.title} className="flow-step-card">
                <span>{item.title}</span>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="cookie-bar">
        <p>
          This platform uses cookies to improve security and investor experience. Review our{' '}
          <a href="#">Cookie Policy</a> for details.
        </p>
        <div>
          <button type="button" className="ghost-button solid-dark">
            Decline
          </button>
          <button type="button" className="primary-button gradient-button">
            Accept
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
