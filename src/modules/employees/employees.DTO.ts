import { LeaveRequest, Prisma } from "@/config/generated/client";
import { TEmployeeDTO, TEmployeeDbOutput } from "@/types";

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

export const buildEmployeeDTO = (
  data: TEmployeeDbOutput,
): TEmployeeDTO => {
  const { user, ...rest } = data;
  return {
    ...rest,
    ...user,
  };
};

export const buildEmployeeDetailsDTO = (
  data: TEmployeeDbOutput,
  leaveRequests: LeaveRequest[],
) => {
  const employee = buildEmployeeDTO(data);
  return { ...employee, leaveRequests };
};
