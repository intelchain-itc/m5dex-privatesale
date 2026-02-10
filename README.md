# M5VF Private Sale Platform

This repo contains a full-stack token sale portal for the **M5VF** private sale.

## Structure
- `m5sale-ui`: React + Vite frontend
- `m5sale-api`: Node/Express API with PostgreSQL and chain verifiers
- `smart-contracts`: EVM sale contract + Solana vesting program

## Sale parameters
- Token price: **$0.10**
- Total supply: **5,000,000,000 M5VF**
- Payments: **USDT on ERC20, BEP20, TRC20 testnets**
- Token delivery: **Solana devnet (SPL token)**
- Referral commissions: **10% (L1), 4% (L2), 6% (L3)**

## Frontend setup
```bash
cd m5sale-ui
cp .env.example .env
# set VITE_CLERK_PUBLISHABLE_KEY, VITE_WALLETCONNECT_PROJECT_ID, VITE_INFURA_ID
npm install
npm run dev
```

## Frontend env for production-ready auth + wallet

```
VITE_CLERK_PUBLISHABLE_KEY=
VITE_WALLETCONNECT_PROJECT_ID=
VITE_INFURA_ID=
```

- **Clerk** handles sign-in/sign-up.
- **WalletConnect v2** handles EVM wallets (ERC20/BEP20).
- **TronLink** handles TRC20 wallet connection in-browser.
- **Infura** is used as the EVM RPC provider for Ethereum/Sepolia in wallet connection flows.

## Backend setup
```bash
cd m5sale-api
npm install
cp .env.example .env
# update DATABASE_URL + chain env values
npm run db:setup
npm run dev
```

## Environment variables
The API needs RPC endpoints, treasury addresses, and the Solana mint/treasury secret to verify USDT deposits and send M5VF:

```
EVM_RPC_URL=
EVM_USDT_ADDRESS=
EVM_TREASURY_ADDRESS=

TRON_FULL_NODE=
TRON_USDT_ADDRESS=
TRON_TREASURY_ADDRESS=

SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_M5VF_MINT=
SOLANA_TREASURY_SECRET=
```

## Smart contracts
- `smart-contracts/evm/PrivateSale.sol` handles USDT deposits on EVM chains.
- `smart-contracts/solana/programs/m5vf_vesting` handles Solana vesting claims.

The UI expects the API at `http://localhost:4000` (Vite proxy). Use `VITE_API_URL` if you need a different host.
