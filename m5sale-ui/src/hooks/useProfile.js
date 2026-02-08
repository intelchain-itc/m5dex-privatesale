import { useEffect, useState } from 'react';
import { useWallet } from '../context/WalletContext.jsx';

export const useProfile = () => {
  const { wallet } = useWallet();
  const [profile, setProfile] = useState({ referralCode: null, commissionTotal: 0 });

  useEffect(() => {
    const loadProfile = async () => {
      if (!wallet) {
        setProfile({ referralCode: null, commissionTotal: 0 });
        return;
      }
      const response = await fetch(`/api/profile?wallet=${wallet}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    };
    loadProfile();
  }, [wallet]);

  return profile;
};
