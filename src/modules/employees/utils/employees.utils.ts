import { buildUserWhereClause } from "@/modules/users/utils";
import { differenceInBusinessDays } from "date-fns";
import { TEmployeeFilters } from "../validation";

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
