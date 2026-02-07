import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const WalletContext = createContext();
const STORAGE_KEY = 'm5sale-wallet';

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState('');
  const [solanaAddress, setSolanaAddress] = useState('');
  const [email, setEmail] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setWallet(parsed.wallet || '');
      setSolanaAddress(parsed.solanaAddress || '');
      setEmail(parsed.email || '');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ wallet, solanaAddress, email })
    );
  }, [wallet, solanaAddress, email]);

  const value = useMemo(
    () => ({
      wallet,
      solanaAddress,
      email,
      setWallet,
      setSolanaAddress,
      setEmail,
      isModalOpen,
      openModal: () => setModalOpen(true),
      closeModal: () => setModalOpen(false),
    }),
    [wallet, solanaAddress, email, isModalOpen]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

WalletProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useWallet = () => useContext(WalletContext);
