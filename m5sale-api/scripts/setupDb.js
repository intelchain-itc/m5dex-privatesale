import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const run = async () => {
  try {
    await pool.query(schema);
    console.log('Database schema applied.');
  } catch (error) {
    console.error('Failed to apply schema', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

run();
