import prisma from "@/config/database";
import {
  productInclude,
  TCreateProductPayload,
  TProductFilters,
  TUpdateProductPayload,
} from "../validation";
import {
  buildProductOrderByClause,
  buildProductWhereClause,
  generateBarcode,
  generateQRCode,
  generateSku,
  toThumbnail,
} from "../utils";
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

export const create = async (payload: TCreateProductPayload) => {
  const barCode = generateBarcode();
  const sku = generateSku();
  const qrCode = await generateQRCode(sku);
  return await prisma.product.create({
    data: {
      ...payload,
      barCode,
      sku,
      qrCode,
      thumbnail: toThumbnail(payload.images[0]),
      warrantyInformation: payload.warrantyInformation ?? "",
      shippingInformation: payload.shippingInformation ?? "",
      returnPolicy: payload.returnPolicy ?? "",
      discountPercentage: payload.discountPercentage ?? 0,
      rating: 0,
    },
    include: productInclude,
  });
};

export const update = async (id: number, payload: TUpdateProductPayload) =>
  await prisma.product.update({
    where: { id },
    data: payload,
    include: productInclude,
  });

export const deleteProduct = async (id: number) =>
  await prisma.product.delete({ where: { id } });
