import { useTheme } from '../context/ThemeContext.jsx';
import { useWallet } from '../context/WalletContext.jsx';
import { UserButton } from '@clerk/clerk-react';

const TopBar = () => {
  const { theme, toggleTheme } = useTheme();
  const { wallet, tronWallet, openModal } = useWallet();

  return (
    <header className="top-bar">
      <div>
        <h1>Dashboard</h1>
        <p>Solana testnet token sale portal</p>
      </div>
      <div className="top-actions">
        {wallet ? <span className="wallet-pill">EVM: {wallet.slice(0, 6)}...{wallet.slice(-4)}</span> : null}
        {tronWallet ? (
          <span className="wallet-pill">TRON: {tronWallet.slice(0, 6)}...{tronWallet.slice(-4)}</span>
        ) : null}
        <button className="ghost-button" onClick={toggleTheme}>
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button className="primary-button" onClick={openModal}>
          {wallet || tronWallet ? 'Manage Wallets' : 'Connect Wallet'}
        </button>
        <UserButton appearance={{ elements: { avatarBox: 'clerk-avatar' } }} />
      </div>
    </header>
  );
};

export default TopBar;
