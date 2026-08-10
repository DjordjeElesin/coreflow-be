import prisma from "@/config/database";
import { orderDetailsSelect } from "../orders.DTO";
import { BadRequestError } from "@/errors";
import { OrderStatus } from "@/config/generated/enums";
import { OrderItem } from "@/config/generated/client";
import { findById } from "./orders.service.core";

const validateOrderItemsAvailability = async (orderItems: OrderItem[]) => {
  const insufficientItems = [];

  for (const { productId, quantity } of orderItems) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, stock: true, reserved: true },
    });
    if (!product) continue;

    const availableToPromise = product.stock - product.reserved;

    if (quantity > availableToPromise) {
      insufficientItems.push({
        id: productId,
        name: product.name,
        availableToPromise,
      });
      continue;
    }
  }

  if (insufficientItems.length)
    throw new BadRequestError(
      "Some order items have insufficient availability to promise.",
      insufficientItems,
    );
};

/**
 * @CONFIRM ORDER
 */
export const confirmOrder = async (id: number) => {
  const order = await findById(id, { status: true, orderItems: true });
  if (order.status !== OrderStatus.DRAFT)
    throw new BadRequestError(`Only DRAFT orders can be confirmed.`);
  if (!order.orderItems.length)
    throw new BadRequestError(
      "Order with no items added can not be confirmed.",
    );

  return await prisma.$transaction(async (tx) => {
    await validateOrderItemsAvailability(order.orderItems);

    for (const { productId, quantity } of order.orderItems) {
      await tx.product.update({
        where: { id: productId },
        data: { reserved: { increment: quantity } },
      });
    }

    return await tx.order.update({
      where: { id },
      data: { status: OrderStatus.CONFIRMED },
      select: orderDetailsSelect,
    });
  });
};

/**
 * @CANCEL ORDER
 */
export const cancelOrder = async (id: number) => {
  const order = await findById(id, { status: true, orderItems: true });

  if (order.status !== OrderStatus.CONFIRMED)
    throw new BadRequestError(`${order.status} order can not be canceled`);

  return prisma.$transaction(async (tx) => {
    for (const { productId, quantity } of order.orderItems) {
      await tx.$executeRaw`
        UPDATE "products"
        SET "reserved" = GREATEST(0, "reserved" - ${quantity})
        WHERE "id" = ${productId}
      `;
    }
    return await tx.order.update({
      where: { id },
      data: { status: OrderStatus.CANCELLED },
      select: orderDetailsSelect,
    });
  });
};

/**
 * @SHIP ORDER
 */
export const shipOrder = async (id: number) => {
  const order = await findById(id, { status: true, orderItems: true });
  if (order.status !== OrderStatus.CONFIRMED)
    throw new BadRequestError(`Only CONFIRMED orders can be shipped.`);

  return await prisma.$transaction(async (tx) => {
    for (const { productId, quantity } of order.orderItems) {
      await tx.product.update({
        where: { id: productId },
        data: {
          reserved: { decrement: quantity },
          stock: { decrement: quantity },
        },
      });
    }

    return await tx.order.update({
      where: { id },
      data: { status: OrderStatus.SHIPPED },
      select: orderDetailsSelect,
    });
  });
};

export const deliveredOrder = async (id: number) => {
  const order = await findById(id, { status: true, orderItems: true });
  if (order.status !== OrderStatus.SHIPPED)
    throw new BadRequestError(`Only SHIPPED orders can be delivered.`);

  return await prisma.order.update({
    where: { id },
    data: { status: OrderStatus.DELIVERED },
    select: orderDetailsSelect,
  });
};
