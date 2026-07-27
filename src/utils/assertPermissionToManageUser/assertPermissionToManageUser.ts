import { Role } from "@/config/generated/enums";
import { ERROR_MSGS } from "@/constants";
import { ForbiddenError } from "@/errors";
import { TAuthUser } from "@/types";

const ROLE_RANK: Record<Role, number> = {
  [Role.ADMIN]: 3,
  [Role.MODERATOR]: 2,
  [Role.USER]: 1,
};

export const assertPermissionToManageUser = (
  initiator: TAuthUser,
  target: TAuthUser,
) => {
  const canEdit =
    initiator.id === target.id ||
    ROLE_RANK[initiator.role] > ROLE_RANK[target.role];

  if (!canEdit) throw new ForbiddenError(ERROR_MSGS.no_permission_action);
};
