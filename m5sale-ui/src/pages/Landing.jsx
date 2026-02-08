import { Link } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';

const tokenomics = [
  { label: 'Private Sale', value: '20%' },
  { label: 'Liquidity', value: '18%' },
  { label: 'Team & Advisors', value: '15%' },
  { label: 'Ecosystem', value: '22%' },
  { label: 'Rewards', value: '15%' },
  { label: 'Treasury', value: '10%' },
];

const Landing = () => {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref');
  const signUpUrl = ref ? `/sign-up?ref=${ref}` : '/sign-up';
  const signInUrl = ref ? `/sign-in?ref=${ref}` : '/sign-in';

  return (
    <div className="landing">
      <nav className="landing-nav">
        <img src="https://m5dex.com/images/logo-high-res.png" alt="M5DEX" />
        <div className="landing-nav-actions">
          <SignedOut>
            <Link className="ghost-button" to={signInUrl}>
              Login
            </Link>
            <Link className="primary-button" to={signUpUrl}>
              Sign up
            </Link>
          </SignedOut>
          <SignedIn>
            <Link className="primary-button" to="/dashboard">
              Open Dashboard
            </Link>
          </SignedIn>
        </div>
      </nav>

      <header className="landing-hero">
        <div>
          <span className="badge">M5VF Private Sale</span>
          <h1>Liquidity-first private sale for the M5DEX ecosystem.</h1>
          <p>
            A production-grade, multi-chain private sale portal with USDT on ERC20, BEP20, and
            TRC20 testnets. Receive M5VF on Solana devnet with automated vesting, holdings, and
            referral rewards.
          </p>
          <div className="hero-actions">
            <SignedOut>
              <Link className="primary-button" to={signUpUrl}>
                Start private sale
              </Link>
              <Link className="ghost-button" to={signInUrl}>
                Login
              </Link>
            </SignedOut>
            <SignedIn>
              <Link className="primary-button" to="/dashboard">
                Go to Dashboard
              </Link>
            </SignedIn>
          </div>
          <div className="hero-stats">
            <div>
              <span>Token price</span>
              <strong>$0.10</strong>
            </div>
            <div>
              <span>Total supply</span>
              <strong>5.0B M5VF</strong>
            </div>
            <div>
              <span>Networks</span>
              <strong>ERC20 · BEP20 · TRC20</strong>
            </div>
          </div>
        </div>
        <div className="hero-card">
          <h3>Sale snapshot</h3>
          <ul>
            <li>Private sale round: <strong>Live</strong></li>
            <li>Allocation: <strong>5.0B M5VF</strong></li>
            <li>Vesting: <strong>Cliff + linear</strong></li>
            <li>Delivery: <strong>Solana Devnet</strong></li>
          </ul>
          <div className="hero-card-footer">
            <span>Referral rewards</span>
            <strong>10% · 4% · 6%</strong>
          </div>
        </div>
      </header>

      <section className="landing-section">
        <div className="section-header">
          <h2>Tokenomics</h2>
          <p>Distribution overview (dummy values for planning).</p>
        </div>
        <div className="tokenomics-grid">
          {tokenomics.map((item) => (
            <div key={item.label} className="tokenomic-card">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section alt-section">
        <div className="section-header">
          <h2>Private Sale Flow</h2>
          <p>Built for compliance, analytics, and instant on-chain visibility.</p>
        </div>
        <div className="flow-grid">
          <div>
            <h4>1. Register</h4>
            <p>Create an account and connect your EVM + Solana wallets.</p>
          </div>
          <div>
            <h4>2. Pay with USDT</h4>
            <p>Send USDT on ERC20/BEP20/TRC20 testnets to the treasury address.</p>
          </div>
          <div>
            <h4>3. Receive M5VF</h4>
            <p>Tokens are delivered on Solana and vesting is tracked in your dashboard.</p>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="section-header">
          <h2>Why M5DEX</h2>
          <p>Institutional-grade tooling with full transparency.</p>
        </div>
        <div className="feature-grid">
          <div className="feature-card">
            <h4>On-chain verification</h4>
            <p>Track deposits across ERC20, BEP20, and TRC20 networks in real-time.</p>
          </div>
          <div className="feature-card">
            <h4>Smart vesting</h4>
            <p>Automated Solana delivery with cliff-based vesting for every allocation.</p>
          </div>
          <div className="feature-card">
            <h4>Referral engine</h4>
            <p>Three-level unilevel rewards with commission tracking and reporting.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
