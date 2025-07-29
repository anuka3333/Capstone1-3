import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export function authMiddleware(roleRequired) {
  return (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid token" });
      if (roleRequired && decoded.role !== roleRequired) {
        return res.status(403).json({ message: "Forbidden" });
      }
      req.user = decoded;
      next();
    });
  };
}
