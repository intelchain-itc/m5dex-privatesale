import { Link } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';

const highlights = [
  {
    title: 'Instant Portfolio Visibility',
    detail: 'Track deposits, vesting unlocks, and claim windows in one premium dashboard.',
  },
  {
    title: 'Cross-chain Purchase Rail',
    detail: 'Contribute with USDT on ERC20, BEP20, and TRC20 while receiving M5VF on Solana.',
  },
  {
    title: 'Referral Revenue Engine',
    detail: 'Earn dynamic tier rewards with transparent attribution and settlement.',
  },
];

const timeline = [
  { phase: '01', title: 'Create account', text: 'Sign up securely and configure your referral identity.' },
  { phase: '02', title: 'Complete contribution', text: 'Deposit USDT on your preferred supported test network.' },
  { phase: '03', title: 'Track vesting', text: 'Follow token release in real time with countdown-based milestones.' },
  { phase: '04', title: 'Claim & compound', text: 'Claim unlocked M5VF and monitor your growth analytics.' },
];

const Landing = () => {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref');
  const signUpUrl = ref ? `/sign-up?ref=${ref}` : '/sign-up';
  const signInUrl = ref ? `/sign-in?ref=${ref}` : '/sign-in';

  return (
    <div className="landing landing-premium">
      <nav className="landing-nav">
        <img src="https://m5dex.com/images/logo-high-res.png" alt="M5DEX" />
        <div className="landing-nav-actions">
          <SignedOut>
            <Link className="ghost-button" to={signInUrl}>
              Sign in
            </Link>
            <Link className="primary-button" to={signUpUrl}>
              Start now
            </Link>
          </SignedOut>
          <SignedIn>
            <Link className="primary-button" to="/dashboard">
              Open Dashboard
            </Link>
          </SignedIn>
        </div>
      </nav>

      <header className="landing-hero premium-hero">
        <div className="hero-copy">
          <span className="badge">M5VF Private Sale</span>
          <h1>Beautiful investor onboarding built for speed, trust, and conversion.</h1>
          <p>
            Join a state-of-the-art private sale experience with high-clarity analytics, polished UX,
            and secure sign-in/sign-up flows designed for modern crypto users.
          </p>
          <div className="hero-actions">
            <SignedOut>
              <Link className="primary-button" to={signUpUrl}>
                Create account
              </Link>
              <Link className="ghost-button" to={signInUrl}>
                I already have an account
              </Link>
            </SignedOut>
            <SignedIn>
              <Link className="primary-button" to="/dashboard">
                Continue to dashboard
              </Link>
            </SignedIn>
          </div>
          <div className="hero-stats">
            <div>
              <span>Token price</span>
              <strong>$0.10</strong>
            </div>
            <div>
              <span>Supported rails</span>
              <strong>ERC20 · BEP20 · TRC20</strong>
            </div>
            <div>
              <span>Referral split</span>
              <strong>10% · 4% · 6%</strong>
            </div>
          </div>
        </div>

        <div className="premium-panel">
          <p className="premium-panel-label">Live sale status</p>
          <h3>Early access round active</h3>
          <p>
            Funding is open with vesting protections, referral scoring, and transparent milestone
            tracking from one clean interface.
          </p>
          <div className="premium-progress">
            <div>
              <span>Raised</span>
              <strong>$2.15M</strong>
            </div>
            <div>
              <span>Target</span>
              <strong>$8.00M</strong>
            </div>
            <div>
              <span>Completion</span>
              <strong>26.8%</strong>
            </div>
          </div>
          <div className="progress-track">
            <span style={{ width: '26.8%' }} />
          </div>
        </div>
      </header>

      <section className="landing-section">
        <div className="section-header">
          <h2>Why this experience feels premium</h2>
          <p>Every screen is optimized to reduce friction and increase trust.</p>
        </div>
        <div className="feature-grid premium-feature-grid">
          {highlights.map((item) => (
            <article key={item.title} className="feature-card premium-feature-card">
              <h4>{item.title}</h4>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section alt-section">
        <div className="section-header">
          <h2>Simple four-step investor flow</h2>
          <p>Designed for clarity from onboarding to token claim.</p>
        </div>
        <div className="flow-grid premium-flow-grid">
          {timeline.map((item) => (
            <article key={item.phase} className="flow-step-card">
              <span>{item.phase}</span>
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
