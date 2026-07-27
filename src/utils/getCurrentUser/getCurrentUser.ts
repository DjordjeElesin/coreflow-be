import { ERROR_MSGS } from "@/constants";
import { UnauthorizedError } from "@/errors";
import { TAuthUser } from "@/types";
import { Request } from "express";

export const getCurrentUser = (req: Request): TAuthUser => {
  if (!req.user) throw new UnauthorizedError(ERROR_MSGS.authorization_required);
  return req.user;
};
