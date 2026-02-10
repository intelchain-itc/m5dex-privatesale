import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { BrowserProvider } from 'ethers';
import EthereumProvider from '@walletconnect/ethereum-provider';

const WalletContext = createContext();
const STORAGE_KEY = 'm5sale-wallet';

const EVM_CHAINS = [1, 56, 11155111, 97];

const createRpcMap = () => {
  const infuraId = import.meta.env.VITE_INFURA_ID;
  return {
    1: infuraId
      ? `https://mainnet.infura.io/v3/${infuraId}`
      : 'https://ethereum.publicnode.com',
    56: 'https://bsc-dataseed.binance.org',
    11155111: infuraId
      ? `https://sepolia.infura.io/v3/${infuraId}`
      : 'https://ethereum-sepolia-rpc.publicnode.com',
    97: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  };
};

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState('');
  const [tronWallet, setTronWallet] = useState('');
  const [solanaAddress, setSolanaAddress] = useState('');
  const [email, setEmail] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [provider, setProvider] = useState(null);
  const [walletError, setWalletError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setReferralCode(ref);
    }

    if (stored) {
      const parsed = JSON.parse(stored);
      setWallet(parsed.wallet || '');
      setTronWallet(parsed.tronWallet || '');
      setSolanaAddress(parsed.solanaAddress || '');
      setEmail(parsed.email || '');
      setReferralCode(parsed.referralCode || ref || '');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ wallet, tronWallet, solanaAddress, email, referralCode })
    );
  }, [wallet, tronWallet, solanaAddress, email, referralCode]);

  const connectWalletConnect = async () => {
    const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
    if (!projectId) {
      setWalletError('WalletConnect requires VITE_WALLETCONNECT_PROJECT_ID in .env.');
      return '';
    }

    try {
      const walletConnectProvider = await EthereumProvider.init({
        projectId,
        chains: EVM_CHAINS,
        optionalChains: EVM_CHAINS,
        showQrModal: true,
        rpcMap: createRpcMap(),
      });

      await walletConnectProvider.enable();
      const ethersProvider = new BrowserProvider(walletConnectProvider);
      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();

      setProvider(walletConnectProvider);
      setWallet(address);
      setWalletError('');
      return address;
    } catch (error) {
      setWalletError(error.message || 'Failed to connect WalletConnect.');
      return '';
    }
  };

  const disconnectWalletConnect = async () => {
    try {
      await provider?.disconnect?.();
    } finally {
      setProvider(null);
      setWallet('');
    }
  };

  const connectTronLink = async () => {
    const tronLink = window.tronLink;
    if (!tronLink) {
      setWalletError('TronLink extension is not detected. Please install and unlock TronLink.');
      return '';
    }

    try {
      const response = await tronLink.request({ method: 'tron_requestAccounts' });
      const address = response?.[0] || window.tronWeb?.defaultAddress?.base58 || '';
      if (!address) {
        throw new Error('No TRON address was returned by TronLink.');
      }
      setTronWallet(address);
      setWalletError('');
      return address;
    } catch (error) {
      setWalletError(error.message || 'Failed to connect TronLink.');
      return '';
    }
  };

  const value = useMemo(
    () => ({
      wallet,
      tronWallet,
      solanaAddress,
      email,
      referralCode,
      walletError,
      setWallet,
      setTronWallet,
      setSolanaAddress,
      setEmail,
      setReferralCode,
      connectWalletConnect,
      disconnectWalletConnect,
      connectTronLink,
      clearWalletError: () => setWalletError(''),
      isModalOpen,
      openModal: () => setModalOpen(true),
      closeModal: () => setModalOpen(false),
    }),
    [wallet, tronWallet, solanaAddress, email, referralCode, walletError, isModalOpen, provider]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

WalletProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useWallet = () => useContext(WalletContext);
