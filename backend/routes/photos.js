import express from "express";
import multer from "multer";
import { db } from "../db.js";
import { authMiddleware } from "../middleware/authmiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Upload portfolio photo (admin only)
router.post(
  "/upload",
  authMiddleware("admin"),
  upload.single("file"),
  async (req, res) => {
    const { category } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;
    await db.run(
      `INSERT INTO portfolio_photos (category, url) VALUES (?, ?)`,
      [category, fileUrl]
    );
    res.json({ status: "success", url: fileUrl });
  }
);

// Get portfolio photos by category
router.get("/", async (req, res) => {
  const { category } = req.query;
  const photos = await db.all(
    `SELECT * FROM portfolio_photos WHERE category = ?`,
    [category]
  );
  res.json({ status: "success", photos });
});

export default router;
