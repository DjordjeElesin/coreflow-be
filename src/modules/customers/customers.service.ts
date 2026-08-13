import prisma from "@/config/database";
import { ConflictError, NotFoundError } from "@/errors";
import {
  TCreateCustomerPayload,
  TCustomerFilters,
  TUpdateCustomerPayload,
} from "./customers.validation";
import { buildCustomersWhereClause } from "./customers.utils";

export const find = async (filters: TCustomerFilters) =>
  await prisma.customer.findMany({
    where: buildCustomersWhereClause(filters),
    include: { address: true },
  });

export const findById = async (id: number) => {
  const customer = await prisma.customer.findFirst({
    where: { id },
    include: { address: true },
  });

  if (!customer) throw new NotFoundError(`Customer with ID:${id} not found.`);
  return customer;
};

export const findCustomerOrders = async (id: number) => {
  const orders = await prisma.order.findMany({ where: { customerId: id } });
  return orders;
};

export const create = async (payload: TCreateCustomerPayload) => {
  const exists = await prisma.customer.findUnique({
    where: { email: payload.email },
  });
  if (exists)
    throw new ConflictError("Customer with this email already in use");

  const { address, ...customer } = payload;

  return prisma.customer.create({
    data: {
      ...customer,
      address: address && { create: address },
    },
  });
};

export const update = async (id: number, payload: TUpdateCustomerPayload) => {
  await findById(id);
  const { address, ...customer } = payload;

  return prisma.customer.update({
    where: { id },
    data: {
      ...customer,
      address: address && {
        upsert: {
          create: address,
          update: address,
        },
      },
    },
  });
};

export const deleteCustomer = async (id: number) => {
  await findById(id);
  await prisma.customer.delete({ where: { id } });
};
