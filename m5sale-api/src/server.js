import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';
import { ethers } from 'ethers';
import TronWeb from 'tronweb';
import crypto from 'crypto';
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
} from '@solana/spl-token';

dotenv.config();

const { Pool } = pg;
const app = express();
const port = process.env.PORT || 4000;

const TOKEN_PRICE = 0.1;
const TOTAL_SUPPLY = 5_000_000_000;
const USDT_DECIMALS = 6;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const DEFAULT_VESTING = [
  {
    title: 'Seed Round Cliff',
    unlockDate: '2026-04-01',
  },
  {
    title: 'Seed Round Vesting 1',
    unlockDate: '2026-05-01',
  },
  {
    title: 'Seed Round Vesting 2',
    unlockDate: '2026-06-01',
  },
];

app.use(cors());
app.use(express.json());

const toNumber = (value) => (value ? Number(value) : 0);

const generateReferralCode = async () => {
  let code = '';
  while (!code) {
    const candidate = crypto.randomBytes(4).toString('hex');
    const exists = await pool.query('SELECT id FROM users WHERE referral_code = $1', [candidate]);
    if (!exists.rows.length) {
      code = candidate;
    }
  }
  return code;
};

const getReferralChain = async (userId) => {
  const chain = [];
  let currentId = userId;
  for (let level = 1; level <= 3; level += 1) {
    const ref = await pool.query('SELECT referrer_id FROM users WHERE id = $1', [currentId]);
    if (!ref.rows.length || !ref.rows[0].referrer_id) {
      break;
    }
    const referrerId = ref.rows[0].referrer_id;
    chain.push({ level, referrerId });
    currentId = referrerId;
  }
  return chain;
};

const getEvmProvider = () => {
  if (!process.env.EVM_RPC_URL) {
    return null;
  }
  return new ethers.JsonRpcProvider(process.env.EVM_RPC_URL);
};

const getTronClient = () => {
  if (!process.env.TRON_FULL_NODE) {
    return null;
  }
  return new TronWeb({
    fullHost: process.env.TRON_FULL_NODE,
  });
};

const getSolanaClient = () => {
  if (!process.env.SOLANA_RPC_URL) {
    return null;
  }
  return new Connection(process.env.SOLANA_RPC_URL, 'confirmed');
};

const getTreasuryKeypair = () => {
  if (!process.env.SOLANA_TREASURY_SECRET) {
    return null;
  }
  const secret = JSON.parse(process.env.SOLANA_TREASURY_SECRET);
  return Keypair.fromSecretKey(Uint8Array.from(secret));
};

const ensureWallet = async (address) => {
  const existing = await pool.query('SELECT id, holdings FROM wallets WHERE address = $1', [address]);
  if (existing.rows.length) {
    return existing.rows[0];
  }

  const inserted = await pool.query(
    'INSERT INTO wallets (address, holdings) VALUES ($1, $2) RETURNING id, holdings',
    [address, 0]
  );
  const walletId = inserted.rows[0].id;

  const vestingValues = DEFAULT_VESTING.map((row, index) =>
    `($1, $${index * 3 + 2}, $${index * 3 + 3}, $${index * 3 + 4})`
  ).join(',');
  const vestingParams = DEFAULT_VESTING.flatMap((row) => [row.title, row.unlockDate, 0]);

  await pool.query(
    `INSERT INTO vesting (wallet_id, title, unlock_date, amount) VALUES ${vestingValues}`,
    [walletId, ...vestingParams]
  );

  return inserted.rows[0];
};

const getWalletState = async (address) => {
  const wallet = await ensureWallet(address);
  const vesting = await pool.query(
    'SELECT id, title, unlock_date, amount, claimed FROM vesting WHERE wallet_id = $1 ORDER BY unlock_date ASC',
    [wallet.id]
  );
  const participants = await pool.query('SELECT COUNT(*) FROM wallets');

  return {
    holdings: toNumber(wallet.holdings),
    participants: Number(participants.rows[0].count),
    vesting: vesting.rows.map((row) => ({
      id: row.id,
      title: row.title,
      unlockDate: row.unlock_date,
      amount: toNumber(row.amount),
      claimed: toNumber(row.claimed),
    })),
  };
};

const verifyEvmPayment = async ({ txHash, expectedAmount }) => {
  const provider = getEvmProvider();
  if (!provider || !process.env.EVM_USDT_ADDRESS || !process.env.EVM_TREASURY_ADDRESS) {
    throw new Error('EVM configuration missing');
  }
  const receipt = await provider.getTransactionReceipt(txHash);
  if (!receipt) {
    return false;
  }
  const iface = new ethers.Interface(['event Transfer(address indexed from, address indexed to, uint256 value)']);
  const expectedValue = BigInt(Math.round(expectedAmount * 10 ** USDT_DECIMALS));
  return receipt.logs.some((log) => {
    if (log.address.toLowerCase() !== process.env.EVM_USDT_ADDRESS.toLowerCase()) {
      return false;
    }
    try {
      const parsed = iface.parseLog(log);
      const to = parsed.args.to.toLowerCase();
      const value = parsed.args.value;
      return to === process.env.EVM_TREASURY_ADDRESS.toLowerCase() && value >= expectedValue;
    } catch (error) {
      return false;
    }
  });
};

const verifyTronPayment = async ({ txHash, expectedAmount }) => {
  const tronWeb = getTronClient();
  if (!tronWeb || !process.env.TRON_USDT_ADDRESS || !process.env.TRON_TREASURY_ADDRESS) {
    throw new Error('Tron configuration missing');
  }
  const info = await tronWeb.trx.getTransactionInfo(txHash);
  if (!info || !info.log) {
    return false;
  }
  const transferTopic = tronWeb.sha3('Transfer(address,address,uint256)');
  const expectedValue = BigInt(Math.round(expectedAmount * 10 ** USDT_DECIMALS));
  return info.log.some((entry) => {
    if (entry.address !== tronWeb.address.toHex(process.env.TRON_USDT_ADDRESS)) {
      return false;
    }
    if (!entry.topics || entry.topics[0] !== transferTopic) {
      return false;
    }
    const toHex = `0x${entry.topics[2].slice(26)}`;
    const toAddress = tronWeb.address.fromHex(toHex).toLowerCase();
    const value = BigInt(`0x${entry.data}`);
    return toAddress === process.env.TRON_TREASURY_ADDRESS.toLowerCase() && value >= expectedValue;
  });
};

const verifyPayment = async ({ network, txHash, amountPaid }) => {
  if (network === 'erc20' || network === 'bep20') {
    return verifyEvmPayment({ txHash, expectedAmount: amountPaid });
  }
  if (network === 'trc20') {
    return verifyTronPayment({ txHash, expectedAmount: amountPaid });
  }
  throw new Error('Unsupported network');
};

const sendM5VF = async ({ toAddress, amount }) => {
  const connection = getSolanaClient();
  const treasury = getTreasuryKeypair();
  if (!connection || !treasury || !process.env.SOLANA_M5VF_MINT) {
    throw new Error('Solana configuration missing');
  }
  const mint = new PublicKey(process.env.SOLANA_M5VF_MINT);
  const recipient = new PublicKey(toAddress);
  const fromAta = await getAssociatedTokenAddress(mint, treasury.publicKey);
  const toAta = await getAssociatedTokenAddress(mint, recipient);
  const instructions = [];

  const toAccount = await connection.getAccountInfo(toAta);
  if (!toAccount) {
    instructions.push(
      createAssociatedTokenAccountInstruction(treasury.publicKey, toAta, recipient, mint)
    );
  }

  instructions.push(
    createTransferInstruction(fromAta, toAta, treasury.publicKey, BigInt(amount))
  );

  const transaction = new Transaction().add(...instructions);
  const signature = await connection.sendTransaction(transaction, [treasury]);
  await connection.confirmTransaction(signature, 'confirmed');
  return signature;
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/register', async (req, res) => {
  const { wallet, email, clerkId, referralCode } = req.body;
  if (!wallet) {
    return res.status(400).json({ error: 'wallet is required' });
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const walletRow = await ensureWallet(wallet);
    const existing = await client.query('SELECT id, referral_code FROM users WHERE wallet_id = $1', [
      walletRow.id,
    ]);
    if (existing.rows.length) {
      await client.query('COMMIT');
      return res.json({ status: 'ok', referralCode: existing.rows[0].referral_code });
    }

    const code = await generateReferralCode();
    let referrerId = null;
    if (referralCode) {
      const referrer = await client.query('SELECT id FROM users WHERE referral_code = $1', [referralCode]);
      if (referrer.rows.length) {
        referrerId = referrer.rows[0].id;
      }
    }

    await client.query(
      `INSERT INTO users (wallet_id, clerk_id, email, referral_code, referrer_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [walletRow.id, clerkId || null, email || null, code, referrerId]
    );
    await client.query('COMMIT');
    return res.json({ status: 'ok', referralCode: code });
  } catch (error) {
    await client.query('ROLLBACK');
    return res.status(500).json({ error: 'registration failed' });
  } finally {
    client.release();
  const { wallet, email } = req.body;
  if (!wallet) {
    return res.status(400).json({ error: 'wallet is required' });
  }
  try {
    const walletRow = await ensureWallet(wallet);
    await pool.query(
      'INSERT INTO users (wallet_id, email) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [walletRow.id, email || null]
    );
    return res.json({ status: 'ok' });
  } catch (error) {
    return res.status(500).json({ error: 'registration failed' });
  }
});

app.get('/api/state', async (req, res) => {
  const wallet = req.query.wallet;
  if (!wallet) {
    return res.status(400).json({ error: 'wallet is required' });
  }
  try {
    const state = await getWalletState(wallet);
    return res.json(state);
  } catch (error) {
    return res.status(500).json({ error: 'failed to load state' });
  }
});

app.get('/api/profile', async (req, res) => {
  const wallet = req.query.wallet;
  if (!wallet) {
    return res.status(400).json({ error: 'wallet is required' });
  }
  try {
    const walletRow = await ensureWallet(wallet);
    const user = await pool.query('SELECT id, referral_code FROM users WHERE wallet_id = $1', [
      walletRow.id,
    ]);
    const commissions = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) AS total FROM commissions WHERE user_id = $1',
      [user.rows[0]?.id || 0]
    );
    return res.json({
      referralCode: user.rows[0]?.referral_code || null,
      commissionTotal: Number(commissions.rows[0].total || 0),
    });
  } catch (error) {
    return res.status(500).json({ error: 'failed to load profile' });
  }
});

app.post('/api/purchase', async (req, res) => {
  const { wallet, amount, network } = req.body;
  if (!wallet || !amount || !network) {
    return res.status(400).json({ error: 'wallet, amount, and network are required' });
  }

  const tokensAllocated = Number(amount) / TOKEN_PRICE;
  if (tokensAllocated <= 0) {
    return res.status(400).json({ error: 'invalid amount' });
  }

  try {
    const walletRow = await ensureWallet(wallet);
    const inserted = await pool.query(
      `INSERT INTO purchases (wallet_id, network, token_symbol, amount_paid, tokens_allocated)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [walletRow.id, network, 'USDT', amount, tokensAllocated]
    );

    return res.json({
      purchaseId: inserted.rows[0].id,
      treasury: {
        erc20: process.env.EVM_TREASURY_ADDRESS,
        bep20: process.env.EVM_TREASURY_ADDRESS,
        trc20: process.env.TRON_TREASURY_ADDRESS,
      },
      tokensAllocated,
      price: TOKEN_PRICE,
      totalSupply: TOTAL_SUPPLY,
    });
  } catch (error) {
    return res.status(500).json({ error: 'purchase init failed' });
  }
});

app.post('/api/purchase/confirm', async (req, res) => {
  const { wallet, purchaseId, txHash } = req.body;
  if (!wallet || !purchaseId || !txHash) {
    return res.status(400).json({ error: 'wallet, purchaseId, and txHash are required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const walletRow = await ensureWallet(wallet);
    const purchase = await client.query(
      'SELECT id, network, amount_paid, tokens_allocated, status FROM purchases WHERE id = $1 AND wallet_id = $2',
      [purchaseId, walletRow.id]
    );
    if (!purchase.rows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'purchase not found' });
    }

    const row = purchase.rows[0];
    if (row.status === 'confirmed') {
      await client.query('ROLLBACK');
      return res.json({ status: 'already confirmed' });
    }

    const verified = await verifyPayment({
      network: row.network,
      txHash,
      amountPaid: toNumber(row.amount_paid),
    });

    if (!verified) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'payment not verified' });
    }

    await client.query(
      'UPDATE purchases SET status = $1, tx_hash = $2 WHERE id = $3',
      ['confirmed', txHash, row.id]
    );

    await client.query('UPDATE wallets SET holdings = holdings + $1 WHERE id = $2', [
      row.tokens_allocated,
      walletRow.id,
    ]);

    await client.query(
      `UPDATE vesting
       SET amount = amount + $1
       WHERE wallet_id = $2
       AND title = 'Seed Round Cliff'`,
      [Math.floor(row.tokens_allocated * 0.4), walletRow.id]
    );

    const buyerUser = await client.query('SELECT id FROM users WHERE wallet_id = $1', [walletRow.id]);
    if (buyerUser.rows.length) {
      const chain = await getReferralChain(buyerUser.rows[0].id);
      const commissionRates = { 1: 0.1, 2: 0.04, 3: 0.06 };
      for (const entry of chain) {
        const rate = commissionRates[entry.level];
        if (!rate) continue;
        const commissionAmount = Number(row.amount_paid) * rate;
        await client.query(
          `INSERT INTO commissions (user_id, purchase_id, level, rate, amount)
           VALUES ($1, $2, $3, $4, $5)`,
          [entry.referrerId, row.id, entry.level, rate, commissionAmount]
        );
      }
    }

    await client.query('COMMIT');
    const state = await getWalletState(wallet);
    return res.json(state);
  } catch (error) {
    await client.query('ROLLBACK');
    return res.status(500).json({ error: 'purchase confirmation failed' });
  } finally {
    client.release();
  }
});

app.get('/api/purchases', async (req, res) => {
  const { wallet } = req.query;
  if (!wallet) {
    return res.status(400).json({ error: 'wallet is required' });
  }
  try {
    const walletRow = await ensureWallet(wallet);
    const purchases = await pool.query(
      'SELECT id, network, amount_paid, tokens_allocated, tx_hash, status, created_at FROM purchases WHERE wallet_id = $1 ORDER BY created_at DESC',
      [walletRow.id]
    );
    return res.json(purchases.rows);
  } catch (error) {
    return res.status(500).json({ error: 'failed to load purchases' });
  }
});

app.get('/api/airdrops', async (req, res) => {
  const { wallet } = req.query;
  if (!wallet) {
    return res.status(400).json({ error: 'wallet is required' });
  }
  try {
    const walletRow = await ensureWallet(wallet);
    const airdrops = await pool.query(
      'SELECT id, amount, claimed, created_at FROM airdrops WHERE wallet_id = $1 ORDER BY created_at DESC',
      [walletRow.id]
    );
    return res.json(airdrops.rows);
  } catch (error) {
    return res.status(500).json({ error: 'failed to load airdrops' });
  }
});

app.get('/api/commissions', async (req, res) => {
  const { wallet } = req.query;
  if (!wallet) {
    return res.status(400).json({ error: 'wallet is required' });
  }
  try {
    const walletRow = await ensureWallet(wallet);
    const user = await pool.query('SELECT id FROM users WHERE wallet_id = $1', [walletRow.id]);
    if (!user.rows.length) {
      return res.json([]);
    }
    const commissions = await pool.query(
      'SELECT level, rate, amount, created_at FROM commissions WHERE user_id = $1 ORDER BY created_at DESC',
      [user.rows[0].id]
    );
    return res.json(commissions.rows);
  } catch (error) {
    return res.status(500).json({ error: 'failed to load commissions' });
  }
});

app.post('/api/airdrop', async (req, res) => {
  const { wallet, amount } = req.body;
  if (!wallet || !amount) {
    return res.status(400).json({ error: 'wallet and amount are required' });
  }
  try {
    const walletRow = await ensureWallet(wallet);
    const inserted = await pool.query(
      'INSERT INTO airdrops (wallet_id, amount) VALUES ($1, $2) RETURNING id',
      [walletRow.id, amount]
    );
    return res.json({ airdropId: inserted.rows[0].id });
  } catch (error) {
    return res.status(500).json({ error: 'airdrop creation failed' });
  }
});

app.post('/api/airdrop/:id/claim', async (req, res) => {
  const { wallet, solanaAddress } = req.body;
  const airdropId = Number(req.params.id);
  if (!wallet || !airdropId || !solanaAddress) {
    return res.status(400).json({ error: 'wallet, airdrop id and solanaAddress are required' });
  }
  try {
    const walletRow = await ensureWallet(wallet);
    const airdrop = await pool.query(
      'SELECT id, amount, claimed FROM airdrops WHERE id = $1 AND wallet_id = $2',
      [airdropId, walletRow.id]
    );
    if (!airdrop.rows.length) {
      return res.status(404).json({ error: 'airdrop not found' });
    }
    const row = airdrop.rows[0];
    if (toNumber(row.claimed) >= toNumber(row.amount)) {
      return res.status(400).json({ error: 'airdrop already claimed' });
    }
    const signature = await sendM5VF({ toAddress: solanaAddress, amount: toNumber(row.amount) });
    await pool.query('UPDATE airdrops SET claimed = amount WHERE id = $1', [airdropId]);
    return res.json({ status: 'claimed', signature });
  } catch (error) {
    return res.status(500).json({ error: 'airdrop claim failed' });
  }
});

app.post('/api/transfers', async (req, res) => {
  const { wallet, toAddress, amount } = req.body;
  if (!wallet || !toAddress || !amount) {
    return res.status(400).json({ error: 'wallet, toAddress and amount are required' });
  }
  try {
    const walletRow = await ensureWallet(wallet);
    const signature = await sendM5VF({ toAddress, amount });
    await pool.query(
      'INSERT INTO transfers (wallet_id, to_address, amount, tx_hash, status) VALUES ($1, $2, $3, $4, $5)',
      [walletRow.id, toAddress, amount, signature, 'confirmed']
    );
    return res.json({ status: 'sent', signature });
  } catch (error) {
    return res.status(500).json({ error: 'transfer failed' });
  }
});

app.post('/api/vesting/:id/claim', async (req, res) => {
  const { wallet, solanaAddress } = req.body;
  const vestingId = Number(req.params.id);
  if (!wallet || !vestingId || !solanaAddress) {
    return res.status(400).json({ error: 'wallet, vesting id and solanaAddress are required' });
  }
  try {
    const walletRow = await ensureWallet(wallet);
    const vestingRow = await pool.query(
      'SELECT id, unlock_date, amount, claimed FROM vesting WHERE id = $1 AND wallet_id = $2',
      [vestingId, walletRow.id]
    );
    if (!vestingRow.rows.length) {
      return res.status(404).json({ error: 'vesting item not found' });
    }
    const row = vestingRow.rows[0];
    const unlockDate = new Date(row.unlock_date);
    if (new Date() < unlockDate) {
      return res.status(400).json({ error: 'vesting not unlocked yet' });
    }
    const remaining = toNumber(row.amount) - toNumber(row.claimed);
    if (remaining <= 0) {
      return res.status(400).json({ error: 'already claimed' });
    }
    const signature = await sendM5VF({ toAddress: solanaAddress, amount: remaining });
    await pool.query('UPDATE vesting SET claimed = amount WHERE id = $1', [vestingId]);
    const state = await getWalletState(wallet);
    return res.json({ ...state, signature });
  } catch (error) {
    return res.status(500).json({ error: 'claim failed' });
  }
});

app.listen(port, () => {
  console.log(`M5 sale API listening on ${port}`);
});
