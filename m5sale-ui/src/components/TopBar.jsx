import { useTheme } from '../context/ThemeContext.jsx';

const TopBar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="top-bar">
      <div>
        <h1>Dashboard</h1>
        <p>Solana testnet token sale portal</p>
      </div>
      <div className="top-actions">
        <button className="ghost-button" onClick={toggleTheme}>
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button className="primary-button">Connect Wallet</button>
      </div>
    </header>
  );
};

export default TopBar;
