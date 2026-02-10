import PropTypes from 'prop-types';
import { useState } from 'react';
import { useWallet } from '../context/WalletContext.jsx';

const WalletModal = ({ onRegister }) => {
  const {
    wallet,
    tronWallet,
    solanaAddress,
    email,
    referralCode,
    walletError,
    connectWalletConnect,
    disconnectWalletConnect,
    connectTronLink,
    setSolanaAddress,
    setEmail,
    clearWalletError,
    closeModal,
  } = useWallet();

  const [localSolana, setLocalSolana] = useState(solanaAddress);
  const [localEmail, setLocalEmail] = useState(email);

  const handleWalletConnect = async () => {
    clearWalletError();
    await connectWalletConnect();
  };

  const handleTronConnect = async () => {
    clearWalletError();
    await connectTronLink();
  };

  const handleSave = async () => {
    const cleanEmail = localEmail.trim();
    const cleanSolana = localSolana.trim();
    setSolanaAddress(cleanSolana);
    setEmail(cleanEmail);

    if (wallet || tronWallet) {
      await onRegister({ wallet, tronWallet, email: cleanEmail });
    }

    closeModal();
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <h2>Connect Wallet</h2>
        <p>WalletConnect is used for ERC20/BEP20. TronLink is used for TRC20.</p>

        <div className="modal-actions">
          <button className="primary-button" onClick={handleWalletConnect}>
            {wallet ? `Connected: ${wallet.slice(0, 6)}...${wallet.slice(-4)}` : 'Connect WalletConnect'}
          </button>
          {wallet && (
            <button className="ghost-button" onClick={disconnectWalletConnect}>
              Disconnect EVM
            </button>
          )}
        </div>

        <div className="modal-actions">
          <button className="primary-button" onClick={handleTronConnect}>
            {tronWallet
              ? `Connected: ${tronWallet.slice(0, 6)}...${tronWallet.slice(-4)}`
              : 'Connect TronLink'}
          </button>
        </div>

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

        {walletError && <p className="error">{walletError}</p>}
        {referralCode && <p className="helper">Referral code applied: {referralCode}</p>}

        <div className="modal-actions">
          <button className="ghost-button" onClick={closeModal}>
            Cancel
          </button>
          <button className="primary-button" onClick={handleSave}>
            Save
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
