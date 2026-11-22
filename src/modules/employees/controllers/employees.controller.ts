import * as employeesService from "../services";
import { Request, Response } from "express";
import { buildEmployeeDetailsDTO, buildEmployeeDTO } from "../DTOs";
import { validateIdParam } from "@/utils/validationUtils";
import { sendResponse } from "@/utils/sendResponse";
import { HttpStatusCode } from "@/types";
import { TEmployeeFilters } from "../validation";
import { getCurrentUser } from "@/utils/getCurrentUser";

export const getEmployees = async (req: Request, res: Response) => {
  const filters = req.validQuery as TEmployeeFilters;

  const employees = await employeesService.find(filters);
  sendResponse({
    res,
    statusCode: HttpStatusCode.OK,
    data: employees.map(buildEmployeeDTO),
  });
};

export const getEmployee = async (req: Request, res: Response) => {
  const id = validateIdParam(req.params.id);
  const employee = await employeesService.findById(id);
  const leaveRequests =
    await employeesService.findLeaveRequestsByEmployeeId(id);

  sendResponse({
    res,
    statusCode: HttpStatusCode.OK,
    data: buildEmployeeDetailsDTO(employee, leaveRequests),
  });
};

export const createEmployee = async (req: Request, res: Response) => {
  const employee = await employeesService.create(req.body);

  sendResponse({
    res,
    statusCode: HttpStatusCode.CREATED,
    data: buildEmployeeDTO(employee),
  });
};

export const updateEmployee = async (req: Request, res: Response) => {
  const id = validateIdParam(req.params.id);
  const currentUser = getCurrentUser(req);
  const employee = await employeesService.update(id, req.body, currentUser);
  const leaveRequests =
    await employeesService.findLeaveRequestsByEmployeeId(id);

  sendResponse({
    res,
    statusCode: HttpStatusCode.OK,
    data: buildEmployeeDetailsDTO(employee, leaveRequests),
  });
};

export const deleteEmployee = async (req: Request, res: Response) => {
  const id = validateIdParam(req.params.id);
  await employeesService.deleteEmployee(id);

  sendResponse({ res, statusCode: HttpStatusCode.NO_CONTENT });
};
