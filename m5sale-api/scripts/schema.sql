CREATE TABLE IF NOT EXISTS wallets (
  id SERIAL PRIMARY KEY,
  address TEXT UNIQUE NOT NULL,
  holdings NUMERIC DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  wallet_id INTEGER REFERENCES wallets(id) ON DELETE CASCADE,
  email TEXT,
  UNIQUE(wallet_id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vesting (
  id SERIAL PRIMARY KEY,
  wallet_id INTEGER REFERENCES wallets(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  unlock_date DATE NOT NULL,
  amount NUMERIC NOT NULL,
  claimed NUMERIC DEFAULT 0
);

CREATE TABLE IF NOT EXISTS purchases (
  id SERIAL PRIMARY KEY,
  wallet_id INTEGER REFERENCES wallets(id) ON DELETE CASCADE,
  network TEXT NOT NULL,
  token_symbol TEXT NOT NULL,
  amount_paid NUMERIC NOT NULL,
  tokens_allocated NUMERIC NOT NULL,
  tx_hash TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS airdrops (
  id SERIAL PRIMARY KEY,
  wallet_id INTEGER REFERENCES wallets(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  claimed NUMERIC DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transfers (
  id SERIAL PRIMARY KEY,
  wallet_id INTEGER REFERENCES wallets(id) ON DELETE CASCADE,
  to_address TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  tx_hash TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
