import { useCallback, useEffect, useMemo, useState } from 'react';
import { useWallet } from '../context/WalletContext.jsx';

const fallbackState = {
  holdings: 0,
  participants: 0,
  vesting: [
    {
      id: 1,
      title: 'Seed Round Cliff',
      unlockDate: '2026-04-01',
      amount: 0,
      claimed: 0,
    },
    {
      id: 2,
      title: 'Seed Round Vesting 1',
      unlockDate: '2026-05-01',
      amount: 0,
      claimed: 0,
    },
    {
      id: 3,
      title: 'Seed Round Vesting 2',
      unlockDate: '2026-06-01',
      amount: 0,
      claimed: 0,
    },
  ],
};

export const useSaleState = () => {
  const { wallet, solanaAddress } = useWallet();
  const [state, setState] = useState(fallbackState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchState = useCallback(async () => {
    if (!wallet) {
      setState(fallbackState);
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`/api/state?wallet=${wallet}`);
      if (!response.ok) {
        throw new Error('Failed to load sale state');
      }
      const data = await response.json();
      setState(data);
      setError(null);
    } catch (err) {
      setError('API offline, showing cached data.');
    } finally {
      setLoading(false);
    }
  }, [wallet]);

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  const addPurchase = async (amount, network) => {
    if (!wallet) {
      setError('Connect wallet first.');
      return null;
    }
    const response = await fetch('/api/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet, amount, network }),
    });
    if (!response.ok) {
      setError('Purchase initiation failed.');
      return null;
    }
    const data = await response.json();
    return data;
  };

  const confirmPurchase = async (purchaseId, txHash) => {
    if (!wallet) {
      setError('Connect wallet first.');
      return;
    }
    const response = await fetch('/api/purchase/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet, purchaseId, txHash }),
    });
    if (response.ok) {
      await fetchState();
    }
  };

  const claimVesting = async (id) => {
    if (!wallet || !solanaAddress) {
      setError('Connect wallet and Solana address first.');
      return;
    }
    const response = await fetch(`/api/vesting/${id}/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet, solanaAddress }),
    });
    if (response.ok) {
      await fetchState();
    }
  };

  const availableToClaim = useMemo(() => {
    const today = new Date();
    return state.vesting.reduce((total, item) => {
      const unlock = new Date(item.unlockDate);
      if (today >= unlock) {
        return total + (item.amount - item.claimed);
      }
      return total;
    }, 0);
  }, [state.vesting]);

  return {
    state,
    loading,
    error,
    addPurchase,
    confirmPurchase,
    claimVesting,
    availableToClaim,
  };
};
