import { useMemo, useState } from 'react';
import { paymentTokens, saleRounds } from '../data/mockData.js';
import { useSaleState } from '../hooks/useSaleState.js';

const Presale = () => {
  const { addPurchase } = useSaleState();
  const [tokenId, setTokenId] = useState(paymentTokens[0].id);
  const [amount, setAmount] = useState('50');
  const activeRound = saleRounds[0];

  const selectedToken = useMemo(
    () => paymentTokens.find((token) => token.id === tokenId),
    [tokenId]
  );

  const receivedTokens = useMemo(() => {
    const numeric = Number(amount);
    if (!selectedToken || Number.isNaN(numeric)) {
      return 0;
    }
    return Math.floor(numeric * selectedToken.rate);
  }, [amount, selectedToken]);

  const handlePurchase = () => {
    if (receivedTokens > 0) {
      addPurchase(receivedTokens, tokenId);
    }
  };

  return (
    <div className="presale-grid">
      <section className="rounds">
        {saleRounds.map((round) => (
          <article key={round.id} className={`round-card ${round.status === 'LIVE' ? 'active' : ''}`}>
            <div className="round-header">
              <div>
                <h3>{round.name}</h3>
                <p>{round.dateRange}</p>
              </div>
              <span className={`status ${round.status === 'LIVE' ? 'live' : 'upcoming'}`}>
                {round.status}
              </span>
            </div>
            <h2>{round.price} USD</h2>
            <p>per token</p>
            <div className="round-meta">
              <div>
                <span>Allocation</span>
                <strong>{round.allocation}</strong>
              </div>
              <div>
                <span>Percentage</span>
                <strong>{round.percentage}</strong>
              </div>
            </div>
            <div className="discount">
              <span>Price Discount</span>
              <strong>{round.discount}</strong>
            </div>
          </article>
        ))}
      </section>

      <section className="purchase-panel">
        <h3>Participate with stablecoins</h3>
        <div className="input-group">
          <label htmlFor="token-select">Select Token</label>
          <select
            id="token-select"
            value={tokenId}
            onChange={(event) => setTokenId(event.target.value)}
          >
            {paymentTokens.map((token) => (
              <option key={token.id} value={token.id}>
                {token.symbol} ({token.network})
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="amount-input">Amount</label>
          <input
            id="amount-input"
            type="number"
            min="0"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </div>
        <div className="rate-card">
          <p>{activeRound.name} - Active</p>
          <strong>Rate: {selectedToken?.rate.toLocaleString()} tokens per $1</strong>
        </div>
        <div className="receive-row">
          <span>You will receive:</span>
          <strong>{receivedTokens.toLocaleString()} M5VF</strong>
        </div>
        <button className="primary-button wide" onClick={handlePurchase}>
          Connect Wallet & Buy
        </button>
      </section>

      <section className="progress-card">
        <div>
          <h3>Sale Progress - {activeRound.name}</h3>
          <p>Time Remaining</p>
        </div>
        <div className="progress-meta">
          <span>21 days</span>
          <span>22.8%</span>
        </div>
        <div className="progress-bar">
          <span style={{ width: '22.8%' }} />
        </div>
        <div className="progress-dates">
          <span>Start: February 1, 2026</span>
          <span>End: February 28, 2026</span>
        </div>
      </section>
    </div>
  );
};

export default Presale;
