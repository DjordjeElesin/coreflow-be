import { Request, Response } from "express";
import * as ordersService from "../services";
import { orderFiltersSchema } from "../validation/orders.validation";
import { validateIdParam, validateJoiSchema } from "@/utils/validationUtils";
import { sendResponse } from "@/utils/sendResponse";
import { HttpStatusCode } from "@/types";
import { buildOrderDetailsDTO, buildOrderDTO } from "../DTOs";

export const getOrders = async (req: Request, res: Response) => {
  const filters = validateJoiSchema(orderFiltersSchema, req.query);
  const orders = await ordersService.find(filters);

  sendResponse({
    res,
    statusCode: HttpStatusCode.OK,
    data: orders.map(buildOrderDTO),
  });
};

export const getOrderById = async (req: Request, res: Response) => {
  const id = validateIdParam(req.params.id);
  const order = await ordersService.findById(id);

  sendResponse({
    res,
    statusCode: HttpStatusCode.OK,
    data: buildOrderDetailsDTO(order),
  });
};

export const createOrder = async (req: Request, res: Response) => {
  const order = await ordersService.create(req.body);

  sendResponse({
    res,
    statusCode: HttpStatusCode.CREATED,
    data: buildOrderDetailsDTO(order),
  });
};

export const deleteOrder = async (req: Request, res: Response) => {
  const id = validateIdParam(req.params.id);
  await ordersService.deleteOrder(id);

  sendResponse({
    res,
    statusCode: HttpStatusCode.NO_CONTENT,
  });
};

export const confirmOrder = async (req: Request, res: Response) => {
  const id = validateIdParam(req.params.id);
  const order = await ordersService.confirmOrder(id);

  sendResponse({
    res,
    statusCode: HttpStatusCode.OK,
    data: buildOrderDetailsDTO(order),
  });
};

export const cancelOrder = async (req: Request, res: Response) => {
  const id = validateIdParam(req.params.id);
  const order = await ordersService.cancelOrder(id);

  sendResponse({
    res,
    statusCode: HttpStatusCode.OK,
    data: buildOrderDetailsDTO(order),
  });
};

export const shipOrder = async (req: Request, res: Response) => {
  const id = validateIdParam(req.params.id);
  const order = await ordersService.shipOrder(id);

  sendResponse({
    res,
    statusCode: HttpStatusCode.OK,
    data: buildOrderDetailsDTO(order),
  });
};

export const deliverOrder = async (req: Request, res: Response) => {
  const id = validateIdParam(req.params.id);
  const order = await ordersService.deliveredOrder(id);

  sendResponse({
    res,
    statusCode: HttpStatusCode.OK,
    data: buildOrderDetailsDTO(order),
  });
};
