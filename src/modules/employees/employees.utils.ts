import { differenceInBusinessDays } from "date-fns";
import { buildUserWhereClause } from "../users/users.utils";
import { TEmployeeFilters } from "./employees.validation";

export const buildEmployeeWhereClause = (filters: TEmployeeFilters) => {
  const userWhere = buildUserWhereClause(filters);
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
