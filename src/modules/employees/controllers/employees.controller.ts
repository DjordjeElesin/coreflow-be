import * as employeesService from "../services";
import { Request, Response } from "express";
import { buildEmployeeDetailsDTO, buildEmployeeDTO } from "../DTOs";
import { validateIdParam, validateJoiSchema } from "@/utils/validationUtils";
import { sendResponse } from "@/utils/sendResponse";
import { HttpStatusCode } from "@/types";
import { employeeFiltersSchema } from "../validation";
import { getCurrentUser } from "@/utils/getCurrentUser";

export const getEmployees = async (req: Request, res: Response) => {
  const filters = validateJoiSchema(employeeFiltersSchema, req.query);

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

export const createLeaveRequest = async (req: Request, res: Response) => {
  const id = validateIdParam(req.params.id);
  const currentUser = getCurrentUser(req);

  const leaveRequest = await employeesService.createLeaveRequestByEmployeeId(
    id,
    req.body,
    currentUser,
  );

  sendResponse({ res, statusCode: HttpStatusCode.CREATED, data: leaveRequest });
};

export const updateLeaveRequest = async (req: Request, res: Response) => {
  const leaveRequestId = validateIdParam(req.params.id);
  const currentUser = getCurrentUser(req);

  const updated = await employeesService.updateLeaveRequest(
    leaveRequestId,
    req.body,
    currentUser,
  );

  sendResponse({ res, statusCode: HttpStatusCode.OK, data: updated });
};

export const approveLeaveRequest = async (req: Request, res: Response) => {
  const leaveRequestId = validateIdParam(req.params.id);
  const leaveRequest =
    await employeesService.approveLeaveRequest(leaveRequestId);

  sendResponse({ res, statusCode: HttpStatusCode.OK, data: leaveRequest });
};
export const rejectLeaveRequest = async (req: Request, res: Response) => {
  const leaveRequestId = validateIdParam(req.params.id);
  const leaveRequest =
    await employeesService.rejectLeaveRequest(leaveRequestId);

  sendResponse({ res, statusCode: HttpStatusCode.OK, data: leaveRequest });
};

export const deleteLeaveRequest = async (req: Request, res: Response) => {
  const leaveRequestId = validateIdParam(req.params.id);
  const currentUser = getCurrentUser(req);
  await employeesService.deleteLeaveRequest(leaveRequestId, currentUser);

  sendResponse({ res, statusCode: HttpStatusCode.NO_CONTENT });
};
