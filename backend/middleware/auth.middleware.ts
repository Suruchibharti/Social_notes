import jwt from "jsonwebtoken";
import User from "../models/User.model.ts";
import { ApiError } from "../utils/apiError.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";

interface JwtPayload {
  id: string;
}

export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication token is required");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "Authentication token is required");
  }
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is missing from environment variables");
  }

  const decoded = jwt.verify(token, jwtSecret) as unknown as JwtPayload;
  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    throw new ApiError(401, "User attached to this token no longer exists");
  }

  req.user = user;
  next();
});
