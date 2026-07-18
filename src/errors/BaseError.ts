import { HttpStatusCode } from "@/types";

export class BaseError extends Error {
  public readonly httpCode: HttpStatusCode;
  public readonly isOperational: boolean;

  constructor(
    name: string,
    httpCode: HttpStatusCode,
    message: string,
    isOperational = true,
  ) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}
