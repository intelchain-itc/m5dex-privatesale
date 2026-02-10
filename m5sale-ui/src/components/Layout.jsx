import PropTypes from 'prop-types';
import Sidebar from './Sidebar.jsx';
import TopBar from './TopBar.jsx';
import WalletModal from './WalletModal.jsx';
import { useWallet } from '../context/WalletContext.jsx';
import { useUser } from '@clerk/clerk-react';

const Layout = ({ children }) => {
  const { isModalOpen, referralCode } = useWallet();
  const { user } = useUser();

  const handleRegister = async ({ wallet, tronWallet, email }) => {
    const primaryWallet = wallet || tronWallet;
    if (!primaryWallet) {
      return;
    }
    await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wallet: primaryWallet,
        tronWallet,
        email,
        clerkId: user?.id,
        referralCode,
      }),
    });
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <div className="page-content">{children}</div>
      </div>
      {isModalOpen && <WalletModal onRegister={handleRegister} />}
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
