import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const app = express();
const port = process.env.PORT || 4000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const DEFAULT_VESTING = [
  {
    title: 'Seed Round Cliff',
    unlockDate: '2026-04-01',
    amount: 200000,
  },
  {
    title: 'Seed Round Vesting 1',
    unlockDate: '2026-05-01',
    amount: 150000,
  },
  {
    title: 'Seed Round Vesting 2',
    unlockDate: '2026-06-01',
    amount: 150000,
  },
];

app.use(cors());
app.use(express.json());

const toNumber = (value) => (value ? Number(value) : 0);

const ensureWallet = async (address) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const existing = await client.query('SELECT id, holdings FROM wallets WHERE address = $1', [address]);
    if (existing.rows.length) {
      await client.query('COMMIT');
      return existing.rows[0];
    }

    const inserted = await client.query(
      'INSERT INTO wallets (address, holdings) VALUES ($1, $2) RETURNING id, holdings',
      [address, 0]
    );
    const walletId = inserted.rows[0].id;

    const vestingValues = DEFAULT_VESTING.map((row, index) =>
      `($1, $${index * 3 + 2}, $${index * 3 + 3}, $${index * 3 + 4}, $${index * 3 + 5})`
    ).join(',');
    const vestingParams = DEFAULT_VESTING.flatMap((row) => [row.title, row.unlockDate, row.amount, 0]);

    await client.query(
      `INSERT INTO vesting (wallet_id, title, unlock_date, amount, claimed) VALUES ${vestingValues}`,
      [walletId, ...vestingParams]
    );

    await client.query('COMMIT');
    return inserted.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
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

app.post('/api/purchase', async (req, res) => {
  const { wallet, amount } = req.body;
  if (!wallet || !amount) {
    return res.status(400).json({ error: 'wallet and amount are required' });
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const walletRow = await ensureWallet(wallet);
    await client.query('UPDATE wallets SET holdings = holdings + $1 WHERE id = $2', [amount, walletRow.id]);
    await client.query(
      `UPDATE vesting
       SET amount = amount + $1
       WHERE wallet_id = $2
       AND title = 'Seed Round Cliff'`,
      [Math.floor(amount * 0.4), walletRow.id]
    );
    await client.query('COMMIT');
    const state = await getWalletState(wallet);
    return res.json(state);
  } catch (error) {
    await client.query('ROLLBACK');
    return res.status(500).json({ error: 'purchase failed' });
  } finally {
    client.release();
  }
});

app.post('/api/vesting/:id/claim', async (req, res) => {
  const { wallet } = req.body;
  const vestingId = Number(req.params.id);
  if (!wallet || !vestingId) {
    return res.status(400).json({ error: 'wallet and vesting id are required' });
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
    await pool.query('UPDATE vesting SET claimed = amount WHERE id = $1', [vestingId]);
    const state = await getWalletState(wallet);
    return res.json(state);
  } catch (error) {
    return res.status(500).json({ error: 'claim failed' });
  }
});

app.listen(port, () => {
  console.log(`M5 sale API listening on ${port}`);
});
