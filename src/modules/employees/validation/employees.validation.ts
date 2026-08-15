import { ContractType, LeaveRequestType } from "@/config/generated/enums";
import Joi from "joi";
import {
  TCreateUserPayload,
  TUserFilters,
  userFields,
  userFiltersSchema,
} from "../../users/validation/users.validation";

export type TCreateEmployeePayload = TCreateUserPayload & {
  hireDate?: Date;
  contractType: ContractType;
  leaveBalance?: number;
  salary: number;
  departmentId: number;
  positionId: number;
};

export type TEmployeeFilters = TUserFilters & {
  departmentId?: number;
  positionId?: number;
  contractType?: ContractType;
};

export const employeeFiltersSchema = Joi.object<TEmployeeFilters>({
  departmentId: Joi.number().optional(),
  positionId: Joi.number().optional(),
  contractType: Joi.string()
    .valid(...Object.values(ContractType))
    .optional(),
}).concat(userFiltersSchema);

export const createEmployeeSchema = Joi.object<TCreateEmployeePayload>({
  ...userFields,
  hireDate: Joi.date().iso().optional(),
  contractType: Joi.string()
    .valid(...Object.values(ContractType))
    .required(),
  leaveBalance: Joi.number().min(0).optional(),
  salary: Joi.number().min(0).required(),
  departmentId: Joi.number().required(),
  positionId: Joi.number().required(),
});

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
