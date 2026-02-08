import { useState } from 'react';
import { useWallet } from '../context/WalletContext.jsx';

const SendReceive = () => {
  const { wallet } = useWallet();
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState(null);

  const handleSend = async () => {
    if (!wallet) {
      setStatus('Connect wallet first.');
      return;
    }
    const response = await fetch('/api/transfers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet, toAddress, amount: Number(amount) }),
    });
    if (response.ok) {
      const data = await response.json();
      setStatus(`Transfer sent. Tx: ${data.signature}`);
    } else {
      setStatus('Transfer failed.');
    }
  };

  return (
    <div className="send-page">
      <div className="page-header">
        <h2>Send / Receive</h2>
        <p>Send M5VF tokens on Solana testnet.</p>
      </div>
      <div className="panel">
        <div className="input-group">
          <label htmlFor="to-address">Recipient Solana Address</label>
          <input
            id="to-address"
            placeholder="Solana address"
            value={toAddress}
            onChange={(event) => setToAddress(event.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="amount">Amount (M5VF)</label>
          <input
            id="amount"
            type="number"
            min="0"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </div>
        <button className="primary-button" onClick={handleSend}>
          Send Tokens
        </button>
        {status && <p className="status-text">{status}</p>}
      </div>
    </div>
  );
};

export default SendReceive;
