# Solana M5VF Vesting Program (Anchor)

This Anchor program is a minimal vesting contract for M5VF SPL tokens. It creates a vesting account per beneficiary and releases tokens after `unlock_time`.

## Build
```bash
anchor build
```

## Initialize vesting
Call `initialize_vesting` with:
- `beneficiary`: wallet receiving M5VF
- `mint`: M5VF SPL mint
- `total_amount`: token amount in base units
- `unlock_time`: unix timestamp

## Claim
Call `claim` after the unlock time. Tokens transfer from the PDA treasury token account to the beneficiary token account.

> NOTE: The treasury PDA must own an associated token account with enough M5VF balance to cover claims.
