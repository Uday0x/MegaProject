import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";

export const isLoggedIn = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed: Token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.generateAcccesToken_Secret);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    throw new ApiError(401, "Invalid or expired token", false);
  }
};
