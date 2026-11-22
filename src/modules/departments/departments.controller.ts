import { Request, Response } from "express";
import * as departmentsService from "./departments.service";
import { sendResponse } from "@/utils/sendResponse";
import { HttpStatusCode } from "@/types";

export const getDepartments = async (_req: Request, res: Response) => {
  const departments = await departmentsService.find();

  sendResponse({
    res,
    statusCode: HttpStatusCode.OK,
    data: departments,
  });
};
