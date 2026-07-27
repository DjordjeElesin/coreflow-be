import env from "@/config/env";
import { Role } from "@/config/generated/enums";
import { ERROR_MSGS } from "@/constants";
import { ForbiddenError, UnauthorizedError } from "@/errors";
import { TAuthUser } from "@/types";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.accessToken;

  if (!token) throw new UnauthorizedError(ERROR_MSGS.authorization_required);

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as TAuthUser;
    req.user = decoded;
    next();
  } catch (err) {
    throw new UnauthorizedError(ERROR_MSGS.invalid_token);
  }
};

export const requireRoles =
  (roles: Role[]) => (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user)
      throw new UnauthorizedError(ERROR_MSGS.authorization_required);
    if (!roles.includes(req.user.role))
      throw new ForbiddenError(ERROR_MSGS.no_permission_action);

    next();
  };
