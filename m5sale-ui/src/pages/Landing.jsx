import { Link } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';

const navItems = ['Home', 'Ecosystem', 'Tokenomics', 'Roadmap', 'Promotion', 'Private Sale', 'Community'];

const ecosystemCards = [
  {
    title: 'Cross-chain private sale',
    detail: 'Participate with USDT on ERC20, BEP20, and TRC20 while receiving allocation tracking in one place.',
  },
  {
    title: 'Investor confidence stack',
    detail: 'Real-time funding progress, vesting milestones, and transparent referral attribution.',
  },
  {
    title: 'Designed for scale',
    detail: 'A premium onboarding flow built to support a rapidly expanding DeFi ecosystem.',
  },
];

const stats = [
  { label: 'Private sale target', value: '$8,000,000' },
  { label: 'Raised so far', value: '$2,150,000' },
  { label: 'Completion', value: '26.8%' },
  { label: 'Supported chains', value: 'Ethereum · BNB · Tron' },
];

const milestones = [
  { title: 'Q1', detail: 'Launch private sale dashboard and referral architecture.' },
  { title: 'Q2', detail: 'Expand app utilities and introduce ecosystem growth incentives.' },
  { title: 'Q3', detail: 'Token conversion, vesting claims, and analytics suite rollout.' },
  { title: 'Q4', detail: 'Community expansion with multi-product DeFi integrations.' },
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
              <span /> Download App
            </a>
          </div>

          <SignedOut>
            <div className="landing-nav-actions">
              <Link className="ghost-button" to={signInUrl}>
                Sign in
              </Link>
              <Link className="primary-button gradient-button" to={signUpUrl}>
                Join Private Sale
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
            The Future of <span>DeFi</span>
          </h1>
          <p>
            M5DEX has built the underlying foundation for a Multi Trillion Dollar DeFi ecosystem with
            premium private-sale experience.
          </p>
          <h2>Where Legends Scale</h2>

          <SignedOut>
            <div className="hero-actions centered-actions">
              <Link className="primary-button gradient-button hero-cta" to={signUpUrl}>
                Join Private Sale
              </Link>
              <Link className="ghost-button solid-dark" to={signInUrl}>
                Download App <small>BETA</small>
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
            <h2>Ecosystem highlights</h2>
            <p>Crafted to feel powerful, clean, and conversion-focused from first touch to token claim.</p>
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
            <h2>Private sale snapshot</h2>
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
            <h2>Roadmap</h2>
            <p>Built for long-term ecosystem growth.</p>
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
          This website uses cookies to enhance the user experience. See our{' '}
          <a href="#">Cookie Policy</a> for more details.
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
