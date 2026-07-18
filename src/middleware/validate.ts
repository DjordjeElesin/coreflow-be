import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { BadRequestError } from "@/errors";
import { validateJoiSchema } from "@/utils/validationUtils";

export const validatePayload =
  (schema: ObjectSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const { error, value } = validateJoiSchema(schema, req.body);

    if (error) {
      const message = error.details.map(({ message }) => message).join(",\n");
      throw new BadRequestError(message);
    }

    req.body = value;
    next();
  };
