import { TAuthUser } from "./types";

declare global {
  namespace Express {
    interface Request {
      user?: TAuthUser;
    }
  }
}

export {};
