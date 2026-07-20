import env from "@/config/env";
import { Role } from "@/config/generated/enums";
import jwt, { SignOptions } from "jsonwebtoken";

export const generateAccessToken = (userId: number, role: Role) => {
  const payload = { id: userId, role };

  const token = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
  });

  return token;
};

export const generateRefreshToken = (userId: number) => {
  const payload = { id: userId };

  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
  });

  return refreshToken;
};
