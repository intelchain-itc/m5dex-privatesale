import PropTypes from 'prop-types';
import { useState } from 'react';
import { useWallet } from '../context/WalletContext.jsx';

const WalletModal = ({ onRegister }) => {
  const { wallet, solanaAddress, email, setWallet, setSolanaAddress, setEmail, closeModal } = useWallet();
  const [localWallet, setLocalWallet] = useState(wallet);
  const [localSolana, setLocalSolana] = useState(solanaAddress);
  const [localEmail, setLocalEmail] = useState(email);

  const handleSave = () => {
    setWallet(localWallet.trim());
    setSolanaAddress(localSolana.trim());
    setEmail(localEmail.trim());
    onRegister(localWallet.trim(), localEmail.trim());
    closeModal();
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <h2>Connect Wallet</h2>
        <p>Enter your wallet addresses for the private sale.</p>
        <label htmlFor="wallet-input">EVM Wallet (ERC20/BEP20)</label>
        <input
          id="wallet-input"
          placeholder="0x..."
          value={localWallet}
          onChange={(event) => setLocalWallet(event.target.value)}
        />
        <label htmlFor="solana-input">Solana Wallet (for M5VF delivery)</label>
        <input
          id="solana-input"
          placeholder="Solana address"
          value={localSolana}
          onChange={(event) => setLocalSolana(event.target.value)}
        />
        <label htmlFor="email-input">Email (optional)</label>
        <input
          id="email-input"
          placeholder="you@example.com"
          value={localEmail}
          onChange={(event) => setLocalEmail(event.target.value)}
        />
        <div className="modal-actions">
          <button className="ghost-button" onClick={closeModal}>
            Cancel
          </button>
          <button className="primary-button" onClick={handleSave}>
            Save & Register
          </button>
        </div>
      </div>
    </div>
  );
};

WalletModal.propTypes = {
  onRegister: PropTypes.func.isRequired,
};

export default WalletModal;
