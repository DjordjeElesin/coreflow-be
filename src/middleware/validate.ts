import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { validateJoiSchema } from "@/utils/validationUtils/validationUtils";

export const validateBody =
  (schema: ObjectSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    req.body = validateJoiSchema(schema, req.body);
    next();
  };

export const validateQuery =
  (schema: ObjectSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    req.validQuery = validateJoiSchema(schema, req.query);
    next();
  };
