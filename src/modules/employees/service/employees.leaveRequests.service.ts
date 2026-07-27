import { TAuthUser } from "@/types";
import {
  TCreateLeaveRequestPayload,
  TUpdateLeaveRequestPayload,
} from "../employees.validation";
import { BadRequestError, ForbiddenError } from "@/errors";
import { ERROR_MSGS } from "@/constants";
import * as employeesCoreService from "./employees.core.service";
import { getLeaveDurationInDays } from "../employees.utils";
import prisma from "@/config/database";
import { LeaveRequestStatus, Role } from "@/config/generated/enums";
import { assertPermissionToManage } from "@/utils/assertPermissionToManage";

export const findLeaveRequestsByEmployeeId = async (id: number) =>
  prisma.leaveRequest.findMany({ where: { employeeId: id } });

export const createLeaveRequestByEmployeeId = async (
  id: number,
  leaveRequestPayload: TCreateLeaveRequestPayload,
  currentUser: TAuthUser,
) => {
  if (id !== currentUser.id)
    throw new ForbiddenError(ERROR_MSGS.no_permission_action);

  const employee = await employeesCoreService.findById(id);
  const duration = getLeaveDurationInDays(
    leaveRequestPayload.startDate,
    leaveRequestPayload.endDate,
  );
  const newLeaveBalance = employee.leaveBalance - duration;
  if (newLeaveBalance < 0)
    throw new BadRequestError("You do not have sufficient leave days.");

  const [newLeaveRequest] = await prisma.$transaction([
    prisma.leaveRequest.create({
      data: {
        employeeId: id,
        ...leaveRequestPayload,
        status: LeaveRequestStatus.PENDING,
      },
    }),
    prisma.employee.update({
      where: { id },
      data: { leaveBalance: newLeaveBalance },
    }),
  ]);

  return newLeaveRequest;
};

export const updateLeaveRequest = async (
  id: number,
  leaveRequestPayload: TUpdateLeaveRequestPayload,
  currentUser: TAuthUser,
) => {
  const leaveRequest = await prisma.leaveRequest.findFirst({ where: { id } });
  if (!leaveRequest) throw new BadRequestError("Leave request does not exist");

  const employee = await employeesCoreService.findById(leaveRequest.employeeId);
  assertPermissionToManage(currentUser, {
    id: employee.id,
    role: employee.user.role,
  });

  if (
    leaveRequest.status === LeaveRequestStatus.APPROVED &&
    currentUser.role === Role.USER
  )
    throw new ForbiddenError(
      "You do not have permission to update an APPROVED leave request",
    );

  const startDate = leaveRequestPayload.startDate ?? leaveRequest.startDate;
  const endDate = leaveRequestPayload.endDate ?? leaveRequest.endDate;
  const datesChanged =
    new Date(startDate).getTime() !== leaveRequest.startDate.getTime() ||
    new Date(endDate).getTime() !== leaveRequest.endDate.getTime();

  let newLeaveBalance: number | undefined;
  if (datesChanged) {
    const previousDuration = getLeaveDurationInDays(
      leaveRequest.startDate,
      leaveRequest.endDate,
    );
    const nextDuration = getLeaveDurationInDays(startDate, endDate);
    newLeaveBalance = employee.leaveBalance + previousDuration - nextDuration;
    if (newLeaveBalance < 0)
      throw new BadRequestError("You do not have sufficient leave days.");
  }

  return prisma.$transaction(async (tx) => {
    if (newLeaveBalance !== undefined)
      await tx.employee.update({
        where: { id: employee.id },
        data: { leaveBalance: newLeaveBalance },
      });

    return tx.leaveRequest.update({ where: { id }, data: leaveRequestPayload });
  });
};

export const deleteLeaveRequest = async (
  id: number,
  currentUser: TAuthUser,
) => {
  const leaveRequest = await prisma.leaveRequest.findFirst({ where: { id } });
  if (!leaveRequest) throw new BadRequestError("Leave request does not exist");

  const employee = await employeesCoreService.findById(leaveRequest.employeeId);
  assertPermissionToManage(currentUser, {
    id: employee.id,
    role: employee.user.role,
  });

  if (leaveRequest.status === LeaveRequestStatus.PENDING)
    throw new BadRequestError(
      "You can only delete Rejected or Approved leave requests",
    );

  const duration = getLeaveDurationInDays(
    leaveRequest.startDate,
    leaveRequest.endDate,
  );

  await prisma.employee.update({
    where: { id: employee.id },
    data: {
      leaveBalance: { decrement: duration },
      leaveRequests: { delete: { id } },
    },
  });
};
