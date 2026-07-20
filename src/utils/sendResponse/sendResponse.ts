import { HttpStatusCode } from "@/types";
import { Response } from "express";

type TSendResponseOptions<TData> = {
  res: Response;
  data?: TData;
  statusCode: HttpStatusCode;
  message?: string;
  extras?: Record<string, unknown>;
};

export const sendResponse = <TData>({
  res,
  data,
  statusCode,
  message,
  extras,
}: TSendResponseOptions<TData>) => {
  const status = statusCode >= 400 ? "error" : "success";

  res.status(statusCode).json({
    status: status,
    ...(data ? { data } : {}),
    ...(message ? { message } : {}),
    ...(extras ?? {}),
  });
};
