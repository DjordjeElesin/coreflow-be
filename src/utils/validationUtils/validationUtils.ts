import { BadRequestError } from "@/errors";
import { ObjectSchema } from "joi";

export const JOI_VALIDATION_OPTIONS = {
  abortEarly: false,
  stripUnknown: true,
} as const;

export const validateJoiSchema = (
  schema: ObjectSchema,
  toValidate: unknown,
) => {
  const { error, value } = schema.validate(toValidate, JOI_VALIDATION_OPTIONS);
  if (error) {
    const message = error.details.map(({ message }) => message).join(",\n");
    throw new BadRequestError(message);
  }
  return value;
};

export const validateIdParam = (checkId: string | string[]) => {
  const id = Number(checkId);
  if (Number.isNaN(id)) throw new BadRequestError("ID must be a number");
  return id;
};
