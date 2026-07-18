import { HttpStatusCode } from "@/types";
import { BaseError } from "./BaseError";

export class BadRequestError extends BaseError {
  constructor(message = "Bad request") {
    super("BadRequestError", HttpStatusCode.BAD_REQUEST, message);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message = "Unauthorized") {
    super("UnauthorizedError", HttpStatusCode.UNAUTHORIZED, message);
  }
}

export class ForbiddenError extends BaseError {
  constructor(message = "Forbidden") {
    super("ForbiddenError", HttpStatusCode.FORBIDDEN, message);
  }
}

export class NotFoundError extends BaseError {
  constructor(message = "Resource not found") {
    super("NotFoundError", HttpStatusCode.NOT_FOUND, message);
  }
}

export class ConflictError extends BaseError {
  constructor(message = "Conflict") {
    super("ConflictError", HttpStatusCode.CONFLICT, message);
  }
}
