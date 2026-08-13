import { Request, Response } from "express";
import * as customersService from "./customers.service";
import { sendResponse } from "@/utils/sendResponse";
import { HttpStatusCode } from "@/types";
import { validateIdParam, validateJoiSchema } from "@/utils/validationUtils";
import { customerFiltersSchema } from "./customers.validation";

export const getCustomers = async (req: Request, res: Response) => {
  const filters = validateJoiSchema(customerFiltersSchema, req.query);
  const customers = await customersService.find(filters);

  sendResponse({ res, statusCode: HttpStatusCode.OK, data: customers });
};

export const getCustomer = async (req: Request, res: Response) => {
  const id = validateIdParam(req.params.id);
  const customer = await customersService.findById(id);

  sendResponse({ res, statusCode: HttpStatusCode.OK, data: customer });
};

export const getCustomerOrders = async (req: Request, res: Response) => {
  const id = validateIdParam(req.params.id);
  const customerOrders = await customersService.findCustomerOrders(id);

  sendResponse({ res, statusCode: HttpStatusCode.OK, data: customerOrders });
};

export const createCustomer = async (req: Request, res: Response) => {
  const customer = await customersService.create(req.body);
  sendResponse({ res, statusCode: HttpStatusCode.CREATED, data: customer });
};

export const updateCustomer = async (req: Request, res: Response) => {
  const id = validateIdParam(req.params.id);
  const customer = await customersService.update(id, req.body);

  sendResponse({ res, statusCode: HttpStatusCode.OK, data: customer });
};

export const deleteCustomer = async (req: Request, res: Response) => {
  const id = validateIdParam(req.params.id);
  await customersService.deleteCustomer(id);
  sendResponse({ res, statusCode: HttpStatusCode.NO_CONTENT });
};
