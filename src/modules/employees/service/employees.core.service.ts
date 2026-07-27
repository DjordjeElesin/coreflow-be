import prisma from "@/config/database";
import { Prisma } from "@/config/generated/client";
import { NotFoundError } from "@/errors";
import { TAuthUser, TEmployeeDbOutput } from "@/types";
import {
  TCreateEmployeePayload,
  TEmployeeFilters,
} from "../employees.validation";
import { buildUserCreateData } from "../../users/users.utils";
import { buildEmployeeWhereClause } from "../employees.utils";
import { assertPermissionToManageUser } from "@/utils/assertPermissionToManageUser";
import { employeeSelect } from "../employees.DTO";

export const find = async (filters: TEmployeeFilters) =>
  prisma.employee.findMany({
    where: buildEmployeeWhereClause(filters),
    select: employeeSelect,
  });

export const findById = async (id: number): Promise<TEmployeeDbOutput> => {
  const employee = await prisma.employee.findFirst({
    where: {
      id,
      user: { deletedAt: null },
    },
    select: employeeSelect,
  });
  if (!employee) throw new NotFoundError(`Employee with ID:${id} not found`);
  return employee;
};

export const create = async ({
  hireDate,
  contractType,
  leaveBalance,
  salary,
  departmentId,
  positionId,
  ...user
}: TCreateEmployeePayload) =>
  prisma.employee.create({
    data: {
      hireDate,
      contractType,
      leaveBalance,
      salary,
      department: { connect: { id: departmentId } },
      position: { connect: { id: positionId } },
      user: { create: await buildUserCreateData(user) },
    },
    select: employeeSelect,
  });

export const update = async (
  id: number,
  employee: Prisma.EmployeeUncheckedUpdateInput,
  currentUser: TAuthUser,
) => {
  const target = await findById(id);
  assertPermissionToManageUser(currentUser, { id, role: target.user.role });

  return prisma.employee.update({
    where: { id, user: { deletedAt: null } },
    data: employee,
    select: employeeSelect,
  });
};

export const deleteEmployee = async (id: number) => {
  await prisma.employee.update({
    where: { id, user: { deletedAt: null } },
    data: { user: { update: { deletedAt: new Date().toISOString() } } },
  });
};
