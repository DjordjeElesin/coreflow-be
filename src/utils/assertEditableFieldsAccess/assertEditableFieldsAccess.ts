import { Role } from "@/config/generated/enums";
import { ERROR_MSGS } from "@/constants";
import { ForbiddenError, UnauthorizedError } from "@/errors";

export const assertEditableFieldsAccess = <K extends object>(
  allowedFields: Record<Role, (keyof K)[] | "*">,
  payload: K,
  currentRole: Role,
) => {
  if (allowedFields[currentRole] === "*") return;
  const hasForbiddenKeys = Object.keys(payload).some(
    (key) => !allowedFields[currentRole].includes(key as keyof K & string),
  );

  if (hasForbiddenKeys)
    throw new ForbiddenError(ERROR_MSGS.no_permission_fields);
};
