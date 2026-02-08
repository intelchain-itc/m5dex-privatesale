import { useSaleState } from '../hooks/useSaleState.js';
import { marketSummary, saleRounds } from '../data/mockData.js';
import Countdown from '../components/Countdown.jsx';

const Dashboard = () => {
  const { state, loading, error } = useSaleState();
  const activeRound = saleRounds[0];

  return (
    <div className="dashboard-grid">
      <section className="stats-row">
        <div className="stat-card stat-purple">
          <div>
            <h3>Token Price</h3>
            <p>${activeRound.price} USD</p>
          </div>
        </div>
        <div className="stat-card stat-green">
          <div>
            <h3>Participants</h3>
            <p>{loading ? 'Loading...' : state.participants}</p>
          </div>
        </div>
        <div className="stat-card stat-blue">
          <div>
            <h3>Your Holdings</h3>
            <p>{loading ? 'Loading...' : `${state.holdings.toLocaleString()} M5VF`}</p>
          </div>
        </div>
      </section>

      <section className="sale-card">
        <header>
          <div>
            <h2>{activeRound.name}</h2>
            <span className="status">LIVE</span>
          </div>
          <p>Sale ends in</p>
        </header>
        <Countdown endsAt={activeRound.endsAt} />
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
            <span>Percentage</span>
            <strong>{activeRound.percentage}</strong>
          </div>
          <div>
            <span>Price Discount</span>
            <strong className="highlight">{activeRound.discount}</strong>
          </div>
        </div>
        <button className="primary-button wide">Participate Now</button>
        <p className="helper">Join the private sale round and get your M5VF tokens.</p>
        <ul className="benefits">
          <li>Secure token purchase</li>
          <li>Transparent pricing</li>
          <li>Instant token delivery</li>
        </ul>
      </section>

      <aside className="side-panels">
        <div className="panel">
          <h3>Airdrop Overview</h3>
          <p>View and manage your recent airdrops</p>
          <button className="ghost-button">Connect your wallet</button>
        </div>
        <div className="panel">
          <h3>Carbon Vault Activity</h3>
          <p>Track your carbon offset contributions</p>
          <span className="chip">10% APY</span>
          <button className="ghost-button">Connect your wallet</button>
        </div>
      </aside>

      <section className="market-summary">
        <h3>Market Summary</h3>
        {error && <p className="error">{error}</p>}
        <div>
          {marketSummary.map((item) => (
            <div key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
