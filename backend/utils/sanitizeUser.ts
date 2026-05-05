import type { IUser } from "../models/User.model.ts";

export const sanitizeUser = (user: IUser) => {
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};
