import prisma from "@/config/database";
import { TCreateOrderPayload, TOrderFilters } from "../orders.validation";
import {
  buildOrdersOrderByClause,
  buildOrdersWhereClause,
  calculateTotalAmount,
  generateOrderNumber,
} from "../orders.utils";
import { orderDetailsSelect, orderSelect } from "../orders.DTO";
import { BadRequestError, NotFoundError } from "@/errors";
import { OrderStatus } from "@/config/generated/enums";
import { Prisma } from "@/config/generated/client";

export const find = async (filters: TOrderFilters) =>
  await prisma.order.findMany({
    where: buildOrdersWhereClause(filters),
    orderBy: buildOrdersOrderByClause(filters),
    select: orderSelect,
  });

export const findById = async <
  T extends Prisma.OrderSelect = typeof orderDetailsSelect,
>(
  id: number,
  select?: T,
) => {
  const order = await prisma.order.findFirst({
    where: { id },
    select: (select ?? orderDetailsSelect) as T,
  });
  if (!order) throw new NotFoundError(`Order with ID:${id} not found.`);
  return order;
};

export const create = async (payload: TCreateOrderPayload) => {
  const { orderItems, customerId } = payload;
  const productIds = orderItems.map(({ productId }) => productId);

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, price: true, discountPercentage: true },
  });
  const totalAmount = calculateTotalAmount(products, orderItems);

  return await prisma.order.create({
    data: {
      status: OrderStatus.DRAFT,
      orderNumber: generateOrderNumber(),
      totalAmount,
      customerId,
    },
    select: orderDetailsSelect,
  });
};

export const deleteOrder = async (id: number) => {
  const order = await findById(id, { status: true });

  if (order.status !== OrderStatus.DRAFT)
    throw new BadRequestError(`Only DRAFT orders can be deleted`);
  else await prisma.order.delete({ where: { id } });
};
