// db.js
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Load .env variables

const { Pool } = pkg;

// Create a connection pool to Azure PostgreSQL
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  ssl: {
    rejectUnauthorized: false, // required for Azure PostgreSQL
  },
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err.stack);
  } else {
    console.log('Connected to Azure PostgreSQL successfully!');
    release();
  }
});

// Example: create tables if not exist
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        password_hash TEXT,
        role TEXT DEFAULT 'client',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS portfolio_photos (
        id SERIAL PRIMARY KEY,
        category TEXT,
        url TEXT,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS albums (
        id SERIAL PRIMARY KEY,
        client_id INTEGER,
        name TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS album_photos (
        id SERIAL PRIMARY KEY,
        album_id INTEGER,
        url TEXT,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tables created or verified successfully!');
  } catch (err) {
    console.error('Error initializing database:', err.stack);
  }
};

initDB();

export default pool;