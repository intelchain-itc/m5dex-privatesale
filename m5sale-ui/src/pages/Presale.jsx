import { useMemo, useState } from 'react';
import { paymentTokens, saleRounds } from '../data/mockData.js';
import { useSaleState } from '../hooks/useSaleState.js';
import { useWallet } from '../context/WalletContext.jsx';

const Presale = () => {
  const { addPurchase, confirmPurchase, error } = useSaleState();
  const { wallet, tronWallet, openModal } = useWallet();
  const [tokenId, setTokenId] = useState(paymentTokens[0].id);
  const [amount, setAmount] = useState('50');
  const [purchaseInfo, setPurchaseInfo] = useState(null);
  const [txHash, setTxHash] = useState('');
  const activeRound = saleRounds[0];

  const selectedToken = useMemo(
    () => paymentTokens.find((token) => token.id === tokenId),
    [tokenId]
  );

  const isWalletConnected = useMemo(() => {
    if (!selectedToken) {
      return false;
    }
    if (selectedToken.networkKey === 'trc20') {
      return Boolean(tronWallet);
    }
    return Boolean(wallet);
  }, [selectedToken, tronWallet, wallet]);

  const receivedTokens = useMemo(() => {
    const numeric = Number(amount);
    if (!selectedToken || Number.isNaN(numeric)) {
      return 0;
    }
    return Math.floor(numeric * selectedToken.rate);
  }, [amount, selectedToken]);

  const handlePurchase = async () => {
    if (!selectedToken) {
      return;
    }

    if (!isWalletConnected) {
      openModal();
      return;
    }

    const info = await addPurchase(amount, selectedToken.networkKey);
    setPurchaseInfo(info);
  };

  const handleConfirm = async () => {
    if (purchaseInfo?.purchaseId && txHash) {
      await confirmPurchase(purchaseInfo.purchaseId, txHash);
    }
  };

  return (
    <div className="presale-grid">
      <section className="rounds">
        {saleRounds.map((round) => (
          <article key={round.id} className="round-card active">
            <div className="round-header">
              <div>
                <h3>{round.name}</h3>
                <p>{round.dateRange}</p>
              </div>
              <span className="status live">{round.status}</span>
            </div>
            <h2>${round.price} USD</h2>
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
              <span>Total Supply</span>
              <strong>5.0B M5VF</strong>
            </div>
          </article>
        ))}
      </section>

      <section className="purchase-panel">
        <h3>Buy M5VF with USDT</h3>
        <p className="panel-subtitle">Accepted: ERC20, BEP20, TRC20 testnets</p>
        <div className="input-group">
          <label htmlFor="token-select">Select Network</label>
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
          <label htmlFor="amount-input">Amount (USDT)</label>
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
          <strong>Rate: 10 M5VF per $1</strong>
        </div>
        <div className="receive-row">
          <span>You will receive:</span>
          <strong>{receivedTokens.toLocaleString()} M5VF</strong>
        </div>
        <button className="primary-button wide" onClick={handlePurchase}>
          {isWalletConnected ? 'Generate Deposit' : `Connect ${selectedToken?.network} Wallet`}
        </button>
        {purchaseInfo && (
          <div className="purchase-confirm">
            <h4>Send USDT to Treasury</h4>
            <p>Network: {selectedToken?.network}</p>
            <p>Address: {purchaseInfo.treasury[selectedToken?.networkKey]}</p>
            <label htmlFor="tx-hash">Paste transaction hash</label>
            <input
              id="tx-hash"
              placeholder="0x... or tron tx hash"
              value={txHash}
              onChange={(event) => setTxHash(event.target.value)}
            />
            <button className="ghost-button wide" onClick={handleConfirm}>
              Confirm Payment
            </button>
          </div>
        )}
        {error && <p className="error">{error}</p>}
      </section>

      <section className="progress-card">
        <div>
          <h3>Sale Progress - {activeRound.name}</h3>
          <p>Time Remaining</p>
        </div>
        <div className="progress-meta">
          <span>45 days</span>
          <span>12.8%</span>
        </div>
        <div className="progress-bar">
          <span style={{ width: '12.8%' }} />
        </div>
        <div className="progress-dates">
          <span>Start: January 15, 2026</span>
          <span>End: March 31, 2026</span>
        </div>
      </section>
    </div>
  );
};

export default Presale;
