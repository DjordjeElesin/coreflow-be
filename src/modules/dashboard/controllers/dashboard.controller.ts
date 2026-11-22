import { getCurrentUser } from "@/utils/getCurrentUser";
import { Request, Response } from "express";
import * as dashboardService from "../services";
import { sendResponse } from "@/utils/sendResponse";
import { HttpStatusCode } from "@/types";
import {
  TRevenueTrendParams,
  TTopCustomersParams,
  TTopProductsParams,
} from "../validation/dashboard.validation";

export const getSummary = async (req: Request, res: Response) => {
  const currentUser = getCurrentUser(req);
  const data = await dashboardService.getSummary(currentUser);

  sendResponse({ res, statusCode: HttpStatusCode.OK, data });
};

export const getTopProducts = async (req: Request, res: Response) => {
  const data = await dashboardService.getTopProducts(
    req.validQuery as TTopProductsParams,
  );

  sendResponse({ res, statusCode: HttpStatusCode.OK, data });
};

export const getTopCustomers = async (req: Request, res: Response) => {
  const data = await dashboardService.getTopCustomers(
    req.validQuery as TTopCustomersParams,
  );

  sendResponse({ res, statusCode: HttpStatusCode.OK, data });
};

export const getRevenueTrend = async (req: Request, res: Response) => {
  const data = await dashboardService.getRevenueTrend(
    req.validQuery as TRevenueTrendParams,
  );

  sendResponse({ res, statusCode: HttpStatusCode.OK, data });
};
