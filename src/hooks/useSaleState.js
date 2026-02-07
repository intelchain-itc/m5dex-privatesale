import { useEffect, useMemo, useState } from 'react';
import { vestingSchedule } from '../data/mockData.js';

const STORAGE_KEY = 'm5dex-sale-state';

const defaultState = {
  holdings: 0,
  participants: 15,
  vesting: vestingSchedule,
};

const loadState = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultState;
  } catch (error) {
    return defaultState;
  }
};

export const useSaleState = () => {
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    setState(loadState());
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addPurchase = (amount) => {
    setState((prev) => ({
      ...prev,
      holdings: prev.holdings + amount,
      participants: prev.participants + 1,
      vesting: prev.vesting.map((item, index) =>
        index === 0
          ? { ...item, amount: item.amount + Math.floor(amount * 0.4) }
          : item
      ),
    }));
  };

  const claimVesting = (id) => {
    setState((prev) => ({
      ...prev,
      vesting: prev.vesting.map((item) =>
        item.id === id
          ? { ...item, claimed: Math.min(item.amount, item.claimed + item.amount) }
          : item
      ),
    }));
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
    addPurchase,
    claimVesting,
    availableToClaim,
  };
};
