import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db.js";
import { JWT_SECRET } from "../config.js";

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;  // add role here
  const hash = await bcrypt.hash(password, 10);
  try {
    const result = await db.run(
      `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`,
      [name, email, hash, role || "client"]  // default to 'client' if role not provided
    );
    res.json({ status: "success", userId: result.lastID });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
  if (!user) return res.status(404).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "1d",
  });
  res.json({ status: "success", token });
});

// Get all users (admin only)
router.get('/users', async (req, res) => {
  // Optionally add admin authMiddleware here
  try {
    const users = await db.all('SELECT id, name, email FROM users');
    res.json({ status: 'success', users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create user from Auth0 registration (called by Auth0 Action)
router.post('/from-auth0', async (req, res) => {
  const { name, email, auth0_id } = req.body;
  if (!email || !auth0_id) return res.status(400).json({ error: 'Missing email or auth0_id' });
  try {
    // Only create if not exists
    const existing = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existing) return res.json({ status: 'exists', userId: existing.id });
    const result = await db.run(
      `INSERT INTO users (name, email, role, auth0_id) VALUES (?, ?, ?, ?)`,
      [name || '', email, 'client', auth0_id]
    );
    res.json({ status: 'created', userId: result.lastID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
