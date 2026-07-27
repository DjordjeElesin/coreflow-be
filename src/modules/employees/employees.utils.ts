import { differenceInBusinessDays } from "date-fns";
import { buildUserWhere } from "../users/users.utils";
import { TEmployeeFilters } from "./employees.validation";

export const buildEmployeeWhere = (filters: TEmployeeFilters) => {
  const userWhere = buildUserWhere(filters);
  const { departmentId, positionId, contractType } = filters;

  return {
    user: userWhere,
    departmentId,
    positionId,
    contractType,
  };
};

export const getLeaveDurationInDays = (
  startDate: string | Date,
  endDate: string | Date,
) => differenceInBusinessDays(new Date(endDate), new Date(startDate)) + 1;
