import { Prisma } from "@/config/generated/client";
import {
  TOrderDbOutput,
  TOrderDetailsDbOutput,
  TOrderDetailsDTO,
  TOrderDTO,
} from "@/types";
import { calculateDiscountedTotal } from "./orders.utils";

export const orderSelect = {
  id: true,
  orderNumber: true,
  status: true,
  totalAmount: true,
  createdAt: true,
  customer: {
    select: { id: true, firstName: true, lastName: true, email: true },
  },
  orderItems: {
    select: {
      quantity: true,
      unitPrice: true,
      product: { select: { discountPercentage: true } },
    },
  },
} satisfies Prisma.OrderSelect;

export const orderDetailsSelect = {
  ...orderSelect,
  customer: { include: { address: true } },
  orderItems: { include: { product: true } },
} satisfies Prisma.OrderSelect;

//DTOs
export const buildOrderDTO = (order: TOrderDbOutput): TOrderDTO => {
  const { orderItems, ...rest } = order;

  return {
    ...rest,
    discountedTotal: calculateDiscountedTotal(orderItems),
  };
};

export const buildOrderDetailsDTO = (
  order: TOrderDetailsDbOutput,
): TOrderDetailsDTO => {
  const { orderItems, ...rest } = order;

  return {
    ...rest,
    orderItems,
    discountedTotal: calculateDiscountedTotal(orderItems),
  };
};
