import { useTheme } from '../context/ThemeContext.jsx';
import { useWallet } from '../context/WalletContext.jsx';

const TopBar = () => {
  const { theme, toggleTheme } = useTheme();
  const { wallet, openModal } = useWallet();

  return (
    <header className="top-bar">
      <div>
        <h1>Dashboard</h1>
        <p>Solana testnet token sale portal</p>
      </div>
      <div className="top-actions">
        {wallet ? <span className="wallet-pill">{wallet.slice(0, 6)}...{wallet.slice(-4)}</span> : null}
        <button className="ghost-button" onClick={toggleTheme}>
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button className="primary-button" onClick={openModal}>
          {wallet ? 'Update Wallet' : 'Connect Wallet'}
        </button>
      </div>
    </header>
  );
};

export default TopBar;
