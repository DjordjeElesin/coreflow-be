import { Prisma } from "@/config/generated/client";
import { TCreateOrderItemPayload, TOrderFilters } from "./orders.validation";
import { customAlphabet } from "nanoid";
import prisma from "@/config/database";
import { NotFoundError } from "@/errors";

export const buildOrdersWhereClause = (
  filters: TOrderFilters,
): Prisma.OrderWhereInput => {
  const { customer, status, productName } = filters;
  return {
    customer: {
      OR: [
        { firstName: { contains: customer, mode: "insensitive" } },
        { lastName: { contains: customer, mode: "insensitive" } },
        { email: { contains: customer, mode: "insensitive" } },
      ],
    },
    status: status,
    orderItems: {
      some: {
        product: { name: { contains: productName, mode: "insensitive" } },
      },
    },
  };
};

export const buildOrdersOrderByClause = (
  filters: TOrderFilters,
): Prisma.OrderOrderByWithRelationInput => {
  const { sortBy, sortOrder } = filters;
  if (sortBy === "customer")
    return { customer: { firstName: sortOrder, lastName: sortOrder } };
  return { [sortBy]: sortOrder };
};

type TOrderItem = {
  quantity: number;
  unitPrice: number;
  product: {
    discountPercentage: number;
  };
};

type TProducts = {
  id: number;
  price: number;
  discountPercentage: number;
};

export const calculateDiscountedTotal = (orderItems: TOrderItem[]) =>
  orderItems.reduce(
    (sum, item) =>
      (sum = sum +=
        item.unitPrice *
        (item.product.discountPercentage / 100) *
        item.quantity),
    0,
  );

export const generateOrderNumber = () => {
  const ORDER_NUM_PREFIX = "ORD";
  const timestamp = Date.now();
  const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 5);
  return `${ORDER_NUM_PREFIX}${timestamp}-${nanoid()}`;
};

export const calculateTotalAmount = (
  products: TProducts[],
  orderItems: TCreateOrderItemPayload[],
) => {
  const priceById = new Map(products.map((product) => [product.id, product]));
  return orderItems.reduce((sum, { productId, quantity }) => {
    const product = priceById.get(productId);
    if (!product) return 0;
    const discount = product?.price * (product?.discountPercentage / 100);
    const finalPrice = (product?.price - discount) * quantity;
    return (sum = sum += finalPrice);
  }, 0);
};
