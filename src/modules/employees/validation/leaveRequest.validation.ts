import { Prisma } from "@/config/generated/client";
import { LeaveRequestStatus, LeaveRequestType } from "@/config/generated/enums";
import Joi from "joi";

export type TLeaveRequestFilters = {
  leaveType: LeaveRequestType;
  status: LeaveRequestStatus;
  isReviewed: boolean;
};

export type TCreateLeaveRequestPayload = Omit<
  Prisma.LeaveRequestUncheckedCreateInput,
  "employeeId" | "status"
>;
export type TUpdateLeaveRequestPayload = Partial<
  Omit<Prisma.LeaveRequestUncheckedCreateInput, "employeeId">
>;

export const leaveRequestFiltersSchema = Joi.object<TLeaveRequestFilters>({
  leaveType: Joi.string()
    .valid(...Object.values(LeaveRequestType))
    .optional(),
  status: Joi.string()
    .valid(...Object.values(LeaveRequestStatus))
    .optional(),
  isReviewed: Joi.boolean().optional(),
});

const leaveRequestFields = {
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().greater(Joi.ref("startDate")).required(),
  leaveType: Joi.string()
    .valid(...Object.values(LeaveRequestType))
    .required(),
  reason: Joi.string().optional(),
};

export const createLeaveRequestSchema = Joi.object(leaveRequestFields);

export const updateLeaveRequestSchema = createLeaveRequestSchema.fork(
  Object.keys(leaveRequestFields),
  (schema) => schema.optional(),
);
