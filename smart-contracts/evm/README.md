# EVM Private Sale Contract

`PrivateSale.sol` accepts USDT payments (ERC20/BEP20) and records M5VF allocations.

## Notes
- `tokenPriceUsd` uses 2 decimals. Example: `$0.10` = `10`.
- `tokensAllocated` is computed as `usdtAmount * 100 / tokenPriceUsd`.
- This contract only tracks allocations; M5VF delivery happens on Solana.

## Example deploy (Hardhat)
```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

```js
// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  const usdt = "0xYourUSDT";
  const treasury = "0xTreasury";
  const price = 10; // $0.10
  const supply = ethers.parseUnits("5000000000", 0);
  const Sale = await ethers.getContractFactory("PrivateSale");
  const sale = await Sale.deploy(usdt, treasury, price, supply);
  await sale.waitForDeployment();
  console.log("Sale deployed:", await sale.getAddress());
}

main();
```
