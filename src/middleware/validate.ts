import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { validateJoiSchema } from "@/utils/validationUtils/validationUtils";

export const validatePayload =
  (schema: ObjectSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    req.body = validateJoiSchema(schema, req.body);
    next();
  };
