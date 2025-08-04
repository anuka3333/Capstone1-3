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

export default router;
