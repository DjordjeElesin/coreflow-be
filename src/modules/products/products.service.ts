import prisma from "@/config/database";
import {
  productInclude,
  TProductFilters,
  TUpdateProductPayload,
} from "./products.validation";
import {
  buildProductOrderByClause,
  buildProductWhereClause,
} from "./products.utils";
import { NotFoundError } from "@/errors";

export const find = async (filters: TProductFilters) =>
  await prisma.product.findMany({
    where: buildProductWhereClause(filters),
    orderBy: buildProductOrderByClause(filters),
    include: productInclude,
    omit: { categoryId: true },
  });

export const findById = async (id: number) => {
  const product = await prisma.product.findFirst({
    where: { id },
    include: productInclude,
    omit: { categoryId: true },
  });
  if (!product) throw new NotFoundError(`Product with ID:${id} not found.`);
  return product;
};

export const update = async (id: number, payload: TUpdateProductPayload) =>
  await prisma.product.update({ where: { id }, data: payload });

export const deleteProduct = async (id: number) =>
  await prisma.product.delete({ where: { id } });
