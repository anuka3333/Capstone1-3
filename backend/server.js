import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import albumRoutes from "./routes/albums.js";
import photoRoutes from "./routes/photos.js";

const app = express();

// Middleware
app.use(cors()); // Allows frontend or Postman to access API
app.use(express.json()); // Parse JSON bodies

// Routes
app.use("/auth", authRoutes);
app.use("/albums", albumRoutes);
app.use("/photos", photoRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

