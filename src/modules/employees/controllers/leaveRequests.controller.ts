import * as employeesService from "../services";
import { Request, Response } from "express";
import { validateIdParam, validateJoiSchema } from "@/utils/validationUtils";
import { getCurrentUser } from "@/utils/getCurrentUser";
import { sendResponse } from "@/utils/sendResponse";
import { HttpStatusCode } from "@/types";
import { leaveRequestFiltersSchema } from "../validation";

export const getLeaveRequests = async (req: Request, res: Response) => {
  const filters = validateJoiSchema(leaveRequestFiltersSchema, req.params);
  const leaveRequests = employeesService.findLeaveRequests(filters);

  sendResponse({ res, statusCode: HttpStatusCode.OK, data: leaveRequests });
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
