import prisma from "@/config/database";
import env from "@/config/env";
import { Role } from "@/config/generated/enums";
import { ERROR_MSGS } from "@/constants";
import { UnauthorizedError } from "@/errors";
import { TLoginPayload } from "@/types";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/utils/generateToken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const hashToken = (t: string) =>
  crypto.createHash("sha256").update(t).digest("hex");

export const findUniqueByEmail = async (email: string) => {
  const exists = await prisma.user.findUnique({
    where: { email, deletedAt: null },
    select: { id: true, password: true, role: true },
  });

  return exists;
};

export const authenticate = async (payload: TLoginPayload) => {
  const user = await findUniqueByEmail(payload.email);
  if (!user) throw new UnauthorizedError("Invalid email or password");

  const isPasswordOk = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordOk) throw new UnauthorizedError("Invalid email or password");

  return issueTokens({ id: user.id, role: user.role });
};

export const issueTokens = async (user: { id: number; role: Role }) => {
  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      hashedToken: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });
  return { accessToken, refreshToken };
};

export const revokeRefreshToken = async (refreshToken: string) => {
  if (!refreshToken) return;
  await prisma.refreshToken.updateMany({
    where: { hashedToken: hashToken(refreshToken) },
    data: { revoked: true },
  });
};

export const exchangeTokens = async (refreshToken: string) => {
  if (!refreshToken) throw new UnauthorizedError("No refresh token");

  let payload;

  try {
    payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as {
      id: number;
    };
  } catch {
    throw new UnauthorizedError(ERROR_MSGS.invalid_refresh_token);
  }

  const storedRefresh = await prisma.refreshToken.findUnique({
    where: { hashedToken: hashToken(refreshToken) },
  });

  if (
    !storedRefresh ||
    storedRefresh.revoked ||
    storedRefresh.expiresAt < new Date()
  )
    throw new UnauthorizedError(ERROR_MSGS.invalid_refresh_token);

  const user = await prisma.user.findFirst({
    where: { id: payload.id, deletedAt: null },
    select: { id: true, role: true },
  });

  if (!user) throw new UnauthorizedError(ERROR_MSGS.user_not_exist);

  return generateAccessToken(user.id, user.role);
};
