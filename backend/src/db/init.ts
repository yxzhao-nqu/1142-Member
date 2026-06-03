import bcryptjs from 'bcryptjs';
import { Pool, PoolClient } from 'pg';

export const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE
});

export async function initializeDatabase() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS members (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        phone TEXT NOT NULL,
        age INTEGER,
        address TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        expires_at TIMESTAMP WITH TIME ZONE
      )
    `);

    await createDefaultMember(client);
    await client.query('COMMIT');
    console.log('Database initialized successfully');
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Failed to initialize database:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function createDefaultMember(client: PoolClient) {
  const result = await client.query('SELECT id FROM members WHERE name = $1', ['admin']);

  if ((result.rowCount ?? 0) > 0) {
    console.log('Default admin member already exists');
    return;
  }

  const hashedPassword = await bcryptjs.hash('123456', 10);
  await client.query(
    `INSERT INTO members (name, password, phone, age, address)
     VALUES ($1, $2, $3, $4, $5)`,
    ['admin', hashedPassword, '09123456789', 30, '台北市']
  );

  console.log('Default admin member created successfully');
}

