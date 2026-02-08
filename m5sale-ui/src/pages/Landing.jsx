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
        <h1>Build the future of M5VF on Solana.</h1>
        <p>
          Participate in the private sale with USDT on ERC20, BEP20, or TRC20 testnets. Receive
          M5VF on Solana devnet with full vesting, holdings, and airdrop tracking.
        </p>
        <div className="hero-actions">
          <SignedOut>
            <Link className="primary-button" to={signUpUrl}>
              Create account
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
      </div>
      <div className="hero-card">
        <h3>Token highlights</h3>
        <ul>
          <li>Token price: <strong>$0.10</strong></li>
          <li>Total supply: <strong>5,000,000,000 M5VF</strong></li>
          <li>Network: <strong>Solana Devnet</strong></li>
        </ul>
      </div>
    </header>

    <section className="landing-section">
      <h2>Tokenomics</h2>
      <p>Distribution overview (dummy values for planning).</p>
      <div className="tokenomics-grid">
        {tokenomics.map((item) => (
          <div key={item.label} className="tokenomic-card">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </section>

    <section className="landing-section">
      <h2>Private Sale Flow</h2>
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
  </div>
  );
};

export default Landing;
