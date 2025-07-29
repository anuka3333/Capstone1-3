import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import photoRoutes from "./routes/photos.js";
import albumRoutes from "./routes/albums.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/albums", albumRoutes);

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
