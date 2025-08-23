// middleware/auth.js
import jwt from "jsonwebtoken";

/**
 * Auth middleware to protect routes
 * Usage: import { authMiddleware } from "../middleware/auth.js";
 */
export const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header (format: Bearer <token>)
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Authorization format must be 'Bearer <token>'" });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach payload (e.g., { id, email })

    next(); // proceed to protected route
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
