import { Request, Response } from "express";
import * as employeesService from "./employees.service";
import { buildEmployeeDetailsDTO, buildEmployeeDTO } from "./employees.DTO";
import { validateIdParam } from "@/utils/validationUtils";

export const getEmployees = async (_req: Request, res: Response) => {
  const employees = await employeesService.findAll();
  res.status(200).json(employees.map((employee) => buildEmployeeDTO(employee)));
};

export const getEmployee = async (req: Request, res: Response) => {
  const id = validateIdParam(req.params.id);
  const employee = await employeesService.findById(id);
  const leaveRequests =
    await employeesService.findLeaveRequestsByEmployeeId(id);

  res.status(200).json(buildEmployeeDetailsDTO(employee, leaveRequests));
};

export const updateEmployee = async (req: Request, res: Response) => {
  const id = validateIdParam(req.params.id);
  const employee = await employeesService.update(id, req.body);
  const leaveRequests =
    await employeesService.findLeaveRequestsByEmployeeId(id);

  res.status(200).json(buildEmployeeDetailsDTO(employee, leaveRequests));
};
