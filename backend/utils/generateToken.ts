import jwt from "jsonwebtoken";
import type { Types } from "mongoose";

export const generateToken = (userId: Types.ObjectId | string) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is missing from environment variables");
  }

  return jwt.sign({ id: userId.toString() }, jwtSecret, {
    expiresIn: "7d"
  });
};
