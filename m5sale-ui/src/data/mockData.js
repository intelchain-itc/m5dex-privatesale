export const saleRounds = [
  {
    id: 'public-round-2',
    name: 'Public Round 2',
    status: 'LIVE',
    dateRange: 'February 1, 2026',
    price: 0.0005952,
    allocation: '14.76 B',
    percentage: '4%',
    discount: '67.2619%',
    endsAt: new Date('2026-02-28T23:59:59Z').toISOString(),
  },
  {
    id: 'public-round-3',
    name: 'Public Round 3',
    status: 'UPCOMING',
    dateRange: 'March 1, 2026',
    price: 0.0006944,
    allocation: '14.76 B',
    percentage: '4%',
    discount: '61.8056%',
    endsAt: new Date('2026-03-31T23:59:59Z').toISOString(),
  },
];

export const paymentTokens = [
  { id: 'usdt-trc20', name: 'USDT', network: 'TRC20', symbol: 'USDT', rate: 1680 },
  { id: 'usdt-bep20', name: 'USDT', network: 'BEP20', symbol: 'USDT', rate: 1660 },
  { id: 'usdc', name: 'USDC', network: 'Solana', symbol: 'USDC', rate: 1600 },
  { id: 'busd', name: 'BUSD', network: 'BEP20', symbol: 'BUSD', rate: 1500 },
];

export const marketSummary = [
  { label: 'Market Cap', value: '$112.4M' },
  { label: '24h Volume', value: '$6.3M' },
  { label: 'Circulating Supply', value: '5.6B M5VF' },
  { label: 'Total Supply', value: '9.8B M5VF' },
];
