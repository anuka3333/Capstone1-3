import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pool from "./db.js";
import authRoutes from './routes/auth.js';
import albumRoutes from './routes/albums.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Create tables if they don’t exist
const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      password_hash TEXT,
      role TEXT DEFAULT 'client',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS albums (
      id SERIAL PRIMARY KEY,
      client_id INTEGER REFERENCES users(id),
      name TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS album_photos (
      id SERIAL PRIMARY KEY,
      album_id INTEGER REFERENCES albums(id),
      url TEXT,
      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

createTables();

// Mount routers
app.use('/auth', authRoutes);
app.use('/api/albums', albumRoutes);

app.get("/", (req, res) => res.send("Anuka Photos API is running 🚀"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));