import * as employeesService from "./employees.service";
import { Request, Response } from "express";
import { buildEmployeeDetailsDTO, buildEmployeeDTO } from "./employees.DTO";
import { validateIdParam } from "@/utils/validationUtils/validationUtils";
import { sendResponse } from "@/utils/sendResponse";
import { HttpStatusCode } from "@/types";

export const getEmployees = async (_req: Request, res: Response) => {
  const employees = await employeesService.findAll();
  sendResponse({
    res,
    statusCode: HttpStatusCode.OK,
    data: employees.map((employee) => buildEmployeeDTO(employee)),
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

export const updateEmployee = async (req: Request, res: Response) => {
  const id = validateIdParam(req.params.id);
  const employee = await employeesService.update(id, req.body);
  const leaveRequests =
    await employeesService.findLeaveRequestsByEmployeeId(id);

  sendResponse({
    res,
    statusCode: HttpStatusCode.OK,
    data: buildEmployeeDetailsDTO(employee, leaveRequests),
  });
};
