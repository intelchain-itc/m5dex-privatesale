import { useSaleState } from '../hooks/useSaleState.js';
import { useProfile } from '../hooks/useProfile.js';
import { useWallet } from '../context/WalletContext.jsx';
import { marketSummary, saleRounds } from '../data/mockData.js';
import Countdown from '../components/Countdown.jsx';

const Dashboard = () => {
  const { state, loading, error } = useSaleState();
  const activeRound = saleRounds[0];
  const profile = useProfile();
  const { wallet } = useWallet();
  const referralLink = profile.referralCode
    ? `${window.location.origin}/?ref=${profile.referralCode}`
    : '';

  return (
    <div className="dashboard-v2">
      <section className="stats-row">
        <article className="stat-card stat-purple">
          <span>Token Price</span>
          <strong>${activeRound.price} USD</strong>
          <small>Current private round</small>
        </article>
        <article className="stat-card stat-green">
          <span>Participants</span>
          <strong>{loading ? 'Loading...' : state.participants.toLocaleString()}</strong>
          <small>Registered wallets</small>
        </article>
        <article className="stat-card stat-blue">
          <span>Your Holdings</span>
          <strong>{loading ? 'Loading...' : `${state.holdings.toLocaleString()} M5VF`}</strong>
          <small>Purchased balance</small>
        </article>
      </section>

      <div className="dashboard-main-grid">
        <section className="sale-card">
          <header className="sale-header">
            <div>
              <p className="section-eyebrow">Active round</p>
              <h2>{activeRound.name}</h2>
            </div>
            <span className="status">{activeRound.status}</span>
          </header>

          <div className="countdown-wrap">
            <p>Sale ends in</p>
            <Countdown endsAt={activeRound.endsAt} />
          </div>

          <div className="sale-details">
            <div>
              <span>Token Price</span>
              <strong>${activeRound.price} USD</strong>
            </div>
            <div>
              <span>Allocation</span>
              <strong>{activeRound.allocation}</strong>
            </div>
            <div>
              <span>Round Share</span>
              <strong>{activeRound.percentage}</strong>
            </div>
            <div>
              <span>Discount</span>
              <strong className="highlight">{activeRound.discount}</strong>
            </div>
          </div>

          <div className="sale-footer">
            <button className="primary-button">Participate Now</button>
            <ul className="benefits">
              <li>Secure purchase</li>
              <li>Transparent pricing</li>
              <li>Fast settlement</li>
            </ul>
          </div>
        </section>

        <aside className="side-panels">
          <div className="panel">
            <h3>Your Referral Link</h3>
            <p>Share your code and track commissions from your network.</p>
            {wallet && referralLink ? (
              <div className="referral-box">
                <span>{referralLink}</span>
                <strong>${profile.commissionTotal.toFixed(2)} earned</strong>
              </div>
            ) : (
              <button className="ghost-button wide">Connect your wallet</button>
            )}
          </div>

          <div className="panel mini-panel">
            <div>
              <h3>Airdrop Overview</h3>
              <p>Claim-ready rewards will appear here.</p>
            </div>
            <button className="ghost-button wide">Connect wallet</button>
          </div>

          <div className="panel mini-panel">
            <div>
              <h3>Carbon Vault Activity</h3>
              <p>Offset rewards and APY tracking.</p>
            </div>
            <span className="chip">10% APY</span>
          </div>
        </aside>
      </div>

      <section className="market-summary">
        <h3>Market Summary</h3>
        {error && <p className="error">{error}</p>}
        <div className="summary-grid">
          {marketSummary.map((item) => (
            <article key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
