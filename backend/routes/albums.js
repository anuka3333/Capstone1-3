import express from "express";
import multer from "multer";
import { db } from "../db.js";
import { authMiddleware } from "../middleware/authmiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Create album (admin only)
router.post("/create", authMiddleware("admin"), async (req, res) => {
  const { clientId, albumName } = req.body;
  const result = await db.run(
    `INSERT INTO albums (client_id, name) VALUES (?, ?)`,
    [clientId, albumName]
  );
  res.json({ status: "success", albumId: result.lastID });
});

// Upload photo to album (admin only)
router.post(
  "/:albumId/upload",
  authMiddleware("admin"),
  upload.single("file"),
  async (req, res) => {
    const { albumId } = req.params;
    const fileUrl = `/uploads/${req.file.filename}`;
    await db.run(`INSERT INTO album_photos (album_id, url) VALUES (?, ?)`, [
      albumId,
      fileUrl,
    ]);
    res.json({ status: "success", url: fileUrl });
  }
);

// Get album photos (any logged in user)
router.get("/:albumId", authMiddleware(), async (req, res) => {
  const { albumId } = req.params;
  const photos = await db.all(`SELECT * FROM album_photos WHERE album_id = ?`, [
    albumId,
  ]);
  res.json({ status: "success", photos });
});

// Get all albums for the logged-in client
router.get("/my", authMiddleware(), async (req, res) => {
  const userId = req.user.id;
  const albums = await db.all(`SELECT * FROM albums WHERE client_id = ?`, [
    userId,
  ]);
  res.json({ status: "success", albums });
});

export default router;
