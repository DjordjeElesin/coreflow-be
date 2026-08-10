import { HttpStatusCode } from "@/types";

export class BaseError extends Error {
  public readonly httpCode: HttpStatusCode;
  public readonly isOperational: boolean;
  public readonly data?: unknown;

  constructor(
    name: string,
    httpCode: HttpStatusCode,
    message: string,
    isOperational = true,
    data?: unknown,
  ) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;
    this.data = data;

    Error.captureStackTrace(this, this.constructor);
  }
}
