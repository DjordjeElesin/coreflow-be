import * as authService from "../services";
import * as usersService from "@/modules/users/services/users.service";
import { Request, Response } from "express";
import { sendResponse } from "@/utils/sendResponse";
import { HttpStatusCode } from "@/types";
import { UnauthorizedError } from "@/errors";
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "@/utils/setAuthCookies";
import { ERROR_MSGS } from "@/constants";

export const login = async (req: Request, res: Response) => {
  const { accessToken, refreshToken } = await authService.authenticate(
    req.body,
  );

  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);

  sendResponse({
    res,
    statusCode: HttpStatusCode.OK,
    message: "Login successful",
  });
};

export const refresh = async (req: Request, res: Response) => {
  const newToken = await authService.exchangeTokens(req.cookies.refreshToken);

  setAccessTokenCookie(res, newToken);

  sendResponse({
    res,
    statusCode: HttpStatusCode.OK,
    message: "Token refreshed",
  });
};

export const logout = async (req: Request, res: Response) => {
  await authService.revokeRefreshToken(req.cookies.refreshToken);
  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/api/auth" });

  sendResponse({
    res,
    statusCode: HttpStatusCode.OK,
    message: "Logged out successfully",
  });
};

export const getMe = async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError(ERROR_MSGS.authorization_required);
  const user = await usersService.findById(req.user.id);

  sendResponse({ res, statusCode: HttpStatusCode.OK, data: user });
};
