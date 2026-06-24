import pg from "pg";

const { Pool } = pg;

function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL belum diatur. Isi koneksi PostgreSQL di file .env.local.");
  }

  const globalForPg = globalThis;

  if (!globalForPg.pgPool) {
    globalForPg.pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
    });
  }

  return globalForPg.pgPool;
}

export async function query(text, params) {
  return getPool().query(text, params);
}
