import { BadRequestError } from "@/errors";
import { ObjectSchema } from "joi";

export const JOI_VALIDATION_OPTIONS = {
  abortEarly: false,
  stripUnknown: true,
} as const;

export const validateJoiSchema = (schema: ObjectSchema, toValidate: unknown) =>
  schema.validate(toValidate, JOI_VALIDATION_OPTIONS);

export const validateIdParam = (checkId: string | string[]) => {
  const id = Number(checkId);
  if (Number.isNaN(id)) throw new BadRequestError("ID must be a number");
  return id;
};
