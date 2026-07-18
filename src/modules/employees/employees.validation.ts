import { ContractType, LeaveRequestType } from "@/config/generated/enums";
import Joi from "joi";

export const updateEmployeeSchema = Joi.object({
  hireDate: Joi.date().iso().optional(),
  contractType: Joi.string()
    .valid(...Object.values(ContractType))
    .optional(),
  leaveBalance: Joi.number().min(0).optional(),
  salary: Joi.number().min(0).optional(),
  departmentId: Joi.number().optional(),
  positionId: Joi.number().optional(),
});

export const createLeaveRequestSchema = Joi.object({
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().greater(Joi.ref("startDate")).required(),
  leaveType: Joi.string()
    .valid(...Object.values(LeaveRequestType))
    .required(),
  reason: Joi.string().optional(),
});
