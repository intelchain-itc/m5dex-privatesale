import PropTypes from 'prop-types';
import Sidebar from './Sidebar.jsx';
import TopBar from './TopBar.jsx';
import WalletModal from './WalletModal.jsx';
import { useWallet } from '../context/WalletContext.jsx';
import { useUser } from '@clerk/clerk-react';

const Layout = ({ children }) => {
  const { isModalOpen, referralCode } = useWallet();
  const { user } = useUser();

const Layout = ({ children }) => {
  const { isModalOpen } = useWallet();

  const handleRegister = async (wallet, email) => {
    if (!wallet) {
      return;
    }
    await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wallet,
        email,
        clerkId: user?.id,
        referralCode,
      }),
      body: JSON.stringify({ wallet, email }),
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
