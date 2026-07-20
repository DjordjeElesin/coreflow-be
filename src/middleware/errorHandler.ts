import { NextFunction, Request, Response } from "express";
import { BaseError } from "@/errors";
import { HttpStatusCode } from "@/types";
import logger from "@/config/logger";
import env from "@/config/env";
import { sendResponse } from "@/utils/sendResponse";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof BaseError && err.isOperational) {
    logger.warn(`${err.name}: ${err.message}`);
    sendResponse({ res, statusCode: err.httpCode, message: err.message });
    return;
  }

  logger.error("Unhandled error", { message: err.message, stack: err.stack });

  const isProd = env.NODE_ENV === "production";

  sendResponse({
    res,
    statusCode: HttpStatusCode.INTERNAL_SERVER,
    message: isProd ? "Internal server error" : err.message,
  });
};
