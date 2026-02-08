export const saleRounds = [
  {
    id: 'private-round',
    name: 'Private Sale',
    status: 'LIVE',
    dateRange: 'January 15, 2026',
    price: 0.1,
    allocation: '5.0 B',
    percentage: '100%',
    discount: '0%',
    endsAt: new Date('2026-03-31T23:59:59Z').toISOString(),
  },
];

export const paymentTokens = [
  {
    id: 'usdt-erc20',
    name: 'USDT',
    network: 'ERC20',
    symbol: 'USDT',
    rate: 10,
    networkKey: 'erc20',
  },
  {
    id: 'usdt-bep20',
    name: 'USDT',
    network: 'BEP20',
    symbol: 'USDT',
    rate: 10,
    networkKey: 'bep20',
  },
  {
    id: 'usdt-trc20',
    name: 'USDT',
    network: 'TRC20',
    symbol: 'USDT',
    rate: 10,
    networkKey: 'trc20',
  },
];

export const marketSummary = [
  { label: 'Token Price', value: '$0.10' },
  { label: 'Total Supply', value: '5.0B M5VF' },
  { label: 'Accepted', value: 'USDT ERC20/BEP20/TRC20' },
  { label: 'Network', value: 'Solana (Devnet)' },
];
