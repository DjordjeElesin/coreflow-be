import prisma from "@/config/database";
import { Prisma } from "@/config/generated/client";
import { NotFoundError } from "@/errors";
import { TEmployeeDbOutput } from "@/types";

export const employeeSelect = {
  id: true,
  hireDate: true,
  contractType: true,
  leaveBalance: true,
  salary: true,
  user: {
    omit: { password: true, addressId: true, deletedAt: true, updatedAt: true },
    include: { address: true },
  },
  department: { select: { id: true, name: true } },
  position: { select: { id: true, name: true } },
  lastLeaveResetYear: true,
} satisfies Prisma.EmployeeSelect;

export const findAll = async () =>
  prisma.employee.findMany({
    where: { user: { deletedAt: null } },
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
  if (!employee) throw new NotFoundError(`Employee ${id} not found`);
  return employee;
};

export const findLeaveRequestsByEmployeeId = async (id: number) =>
  prisma.leaveRequest.findMany({ where: { employeeId: id } });

export const update = async (
  id: number,
  employee: Prisma.EmployeeUncheckedUpdateInput,
) => {
  const updated = await prisma.employee.update({
    where: { id, user: { deletedAt: null } },
    data: employee,
    select: employeeSelect,
  });
  if (!updated) throw new NotFoundError(`Employee ${id} not found`);
  return updated;
};
