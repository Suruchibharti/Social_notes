import type { IUser } from "../models/User.model.ts";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export {};
