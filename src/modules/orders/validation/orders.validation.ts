import { OrderStatus } from "@/config/generated/enums";
import { ESortOrder } from "@/types";
import Joi from "joi";

type TOrdersSortBy =
  | "customer"
  | "status"
  | "totalAmount"
  | "orderNumber"
  | "createdAt";

export type TOrderFilters = {
  customer?: string;
  status?: OrderStatus;
  productName?: string;
  sortBy: TOrdersSortBy;
  sortOrder: ESortOrder;
};

export type TCreateOrderItemPayload = {
  productId: number;
  quantity: number;
};

export type TCreateOrderPayload = {
  customerId: number;
  orderItems: TCreateOrderItemPayload[];
};

export const orderFiltersSchema = Joi.object<TOrderFilters>({
  customer: Joi.string().optional(),
  status: Joi.string()
    .valid(...Object.values(OrderStatus))
    .optional(),

  productName: Joi.string().optional(),
  sortBy: Joi.string()
    .valid("customer", "status", "orderNumber", "totalAmount", "createdAt")
    .optional(),
  sortOrder: Joi.string()
    .valid(...Object.values(ESortOrder))
    .optional()
    .default(ESortOrder.ASC),
});

export const createOrderItemsSchema = Joi.object({
  productId: Joi.number().required(),
  quantity: Joi.number().min(1).required(),
});

export const createOrderSchema = Joi.object<TCreateOrderPayload>({
  customerId: Joi.number().required(),
  orderItems: Joi.array().items(createOrderItemsSchema).min(1).required(),
});

export const updateOrderSchema = Joi.object({});
