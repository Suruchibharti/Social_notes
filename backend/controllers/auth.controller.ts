import { loginUser, registerUser } from "../services/auth.service.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";

export const register = asyncHandler(async (req, res) => {
  console.log("Request body:", req.body);
  console.log("Uploaded file:", req.file);
  const result = await registerUser(req.body ?? {}, req.file);

  res.status(201).json({
    success: true,
    message: result.message
  });
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body ?? {});

  res.json({
    success: true,
    message: result.message,
    token: result.token,
    user: result.user
  });
});
