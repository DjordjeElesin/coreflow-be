import { LeaveRequest } from "@/config/generated/client";
import { TEmployeeResponseDTO, TEmployeeDbOutput } from "@/types";

export const buildEmployeeDTO = (
  data: TEmployeeDbOutput,
): TEmployeeResponseDTO => {
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
