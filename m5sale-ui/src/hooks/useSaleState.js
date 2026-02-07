import { useCallback, useEffect, useMemo, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '';
const DEMO_WALLET = 'demo-wallet';

const fallbackState = {
  holdings: 0,
  participants: 0,
  vesting: [
    {
      id: 1,
      title: 'Seed Round Cliff',
      unlockDate: '2026-04-01',
      amount: 200000,
      claimed: 0,
    },
    {
      id: 2,
      title: 'Seed Round Vesting 1',
      unlockDate: '2026-05-01',
      amount: 150000,
      claimed: 0,
    },
    {
      id: 3,
      title: 'Seed Round Vesting 2',
      unlockDate: '2026-06-01',
      amount: 150000,
      claimed: 0,
    },
  ],
};

export const useSaleState = () => {
  const [state, setState] = useState(fallbackState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchState = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/state?wallet=${DEMO_WALLET}`);
      if (!response.ok) {
        throw new Error('Failed to load sale state');
      }
      const data = await response.json();
      setState(data);
      setError(null);
    } catch (err) {
      setError('API offline, showing cached data.');
      setState((prev) => (prev?.vesting?.length ? prev : fallbackState));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  const addPurchase = async (amount, tokenId) => {
    const response = await fetch(`${API_BASE}/api/purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet: DEMO_WALLET, amount, tokenId }),
    });
    if (response.ok) {
      await fetchState();
    }
  };

  const claimVesting = async (id) => {
    const response = await fetch(`${API_BASE}/api/vesting/${id}/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet: DEMO_WALLET }),
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
    claimVesting,
    availableToClaim,
  };
};
