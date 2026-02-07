import { useSaleState } from '../hooks/useSaleState.js';

const Vesting = () => {
  const { state, claimVesting, availableToClaim } = useSaleState();

  return (
    <div className="vesting-page">
      <div className="page-header">
        <h2>Vesting Schedule</h2>
        <p>Track your unlocks and claim available tokens.</p>
      </div>

      <div className="vesting-summary">
        <div>
          <span>Total Holdings</span>
          <strong>{state.holdings.toLocaleString()} SAI</strong>
        </div>
        <div>
          <span>Available to Claim</span>
          <strong>{availableToClaim.toLocaleString()} SAI</strong>
        </div>
      </div>

      <div className="vesting-list">
        {state.vesting.map((item) => {
          const remaining = item.amount - item.claimed;
          const unlockDate = new Date(item.unlockDate).toLocaleDateString();
          return (
            <div key={item.id} className="vesting-card">
              <div>
                <h3>{item.title}</h3>
                <p>Unlocks on {unlockDate}</p>
              </div>
              <div>
                <span>Total</span>
                <strong>{item.amount.toLocaleString()} SAI</strong>
              </div>
              <div>
                <span>Remaining</span>
                <strong>{remaining.toLocaleString()} SAI</strong>
              </div>
              <button
                className="primary-button"
                onClick={() => claimVesting(item.id)}
                disabled={remaining === 0}
              >
                {remaining === 0 ? 'Claimed' : 'Claim'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Vesting;
