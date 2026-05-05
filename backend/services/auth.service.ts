import bcrypt from "bcryptjs";
import User from "../models/User.model.ts";
import { ApiError } from "../utils/apiError.ts";
import { generateToken } from "../utils/generateToken.ts";
import { sanitizeUser } from "../utils/sanitizeUser.ts";
import { validateEmail, validatePassword } from "../utils/validation.ts";
import { uploadFile } from "./storage.service.ts";

interface RegisterInput {
  username: string;
  email: string;
  password: string;
  profilePic?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export const registerUser = async (input: Partial<RegisterInput> = {}, file?: Express.Multer.File) => {
  console.log(input) ;
  console.log(file);
  const { username, email, password, profilePic = "" } = input;

  if (!username || !email || !password) {
    throw new ApiError(400, "Username, email, and password are required");
  }

  validateEmail(email);
  validatePassword(password);

  const existingUser = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username }]
  });

  if (existingUser) {
    throw new ApiError(409, "Username or email already exists");
  }

  const profilePicUrl = file ? (await uploadFile(file, "profile-pictures")).url : profilePic;

  const hashedPassword = await bcrypt.hash(password, 12);
  await User.create({
    username,
    email: email.toLowerCase(),
    password: hashedPassword,
    profilePic: profilePicUrl
  });

  return {
    message: "User registered successfully. Please login to continue."
  };
};

export const loginUser = async (input: Partial<LoginInput> = {}) => {
  const { email, password } = input;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  validateEmail(email);

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  return {
    message: "Login successful.",
    token: generateToken(user._id),
    user: sanitizeUser(user)
  };
};
