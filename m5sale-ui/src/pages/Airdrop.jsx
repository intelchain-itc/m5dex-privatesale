import { useEffect, useState } from 'react';
import { useWallet } from '../context/WalletContext.jsx';

const Airdrop = () => {
  const { wallet, solanaAddress } = useWallet();
  const [airdrops, setAirdrops] = useState([]);
  const [error, setError] = useState(null);

  const loadAirdrops = async () => {
    if (!wallet) {
      setAirdrops([]);
      return;
    }
    const response = await fetch(`/api/airdrops?wallet=${wallet}`);
    if (response.ok) {
      const data = await response.json();
      setAirdrops(data);
      setError(null);
    } else {
      setError('Failed to load airdrops');
    }
  };

  useEffect(() => {
    loadAirdrops();
  }, [wallet]);

  const handleClaim = async (airdropId) => {
    if (!wallet || !solanaAddress) {
      setError('Connect wallet and Solana address first.');
      return;
    }
    const response = await fetch(`/api/airdrop/${airdropId}/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet, solanaAddress }),
    });
    if (response.ok) {
      await loadAirdrops();
    } else {
      setError('Claim failed');
    }
  };

  return (
    <div className="airdrop-page">
      <div className="page-header">
        <h2>Airdrop Claims</h2>
        <p>Claim M5VF airdrops delivered to your Solana wallet.</p>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="panel">
        <div className="panel-row">
          <h3>Your Airdrops</h3>
          <button className="ghost-button" onClick={loadAirdrops}>
            Refresh
          </button>
        </div>
        {airdrops.length === 0 ? (
          <p>No airdrops yet.</p>
        ) : (
          <div className="table">
            {airdrops.map((drop) => {
              const remaining = Number(drop.amount) - Number(drop.claimed);
              return (
                <div key={drop.id} className="table-row">
                  <div>
                    <strong>{Number(drop.amount).toLocaleString()} M5VF</strong>
                    <span>Remaining: {remaining.toLocaleString()} M5VF</span>
                  </div>
                  <button
                    className="primary-button"
                    onClick={() => handleClaim(drop.id)}
                    disabled={remaining <= 0}
                  >
                    {remaining <= 0 ? 'Claimed' : 'Claim'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Airdrop;
