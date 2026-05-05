import { ApiError } from "./apiError.ts";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const passwordRegex = /^(?=.*[^A-Za-z0-9]).{6,100}$/;

export const validateEmail = (email: string) => {
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Please enter a valid email address");
  }
};

export const validatePassword = (password: string) => {
  if (!passwordRegex.test(password)) {
    throw new ApiError(
      400,
      "Password must be 6 to 100 characters and include at least 1 special character"
    );
  }
};
