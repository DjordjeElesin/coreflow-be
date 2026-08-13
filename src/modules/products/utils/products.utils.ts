import { EStockLevels } from "@/types";
import { TProductFilters } from "../validation";
import { Prisma } from "@/config/generated/client";
import { customAlphabet } from "nanoid";
import QRCode from "qrcode";
import env from "@/config/env";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";

const nano = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);

export const buildProductWhereClause = (
  filters: TProductFilters,
): Prisma.ProductWhereInput => {
  const { name, brand, categoryId, stock } = filters;
  const stockFilter = () => {
    if (stock === EStockLevels.IN_STOCK) return { gt: 50 };
    if (stock === EStockLevels.LOW_STOCK) return { gte: 10, lte: 50 };
    if (stock === EStockLevels.ALMOST_SOLD_OUT) return { lte: 10, gt: 0 };
    if (stock === EStockLevels.OUT_OF_STOCK) return 0;
    return undefined;
  };
  return {
    name: name ? { contains: name, mode: "insensitive" } : undefined,
    brand: brand ? { contains: brand, mode: "insensitive" } : undefined,
    categoryId,
    stock: stockFilter(),
  };
};

export const buildProductOrderByClause = (
  filters: TProductFilters,
): Prisma.ProductOrderByWithRelationInput => {
  const { sortBy, sortOrder } = filters;
  if (sortBy === "category")
    return {
      category: {
        name: sortOrder,
      },
    };
  return { [sortBy]: sortOrder };
};

export const generateBarcode = () => {
  const base = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10));
  const sum = base.reduce((acc, d, i) => acc + d * (i % 2 === 0 ? 1 : 3), 0);
  return [...base, (10 - (sum % 10)) % 10].join("");
};
export const generateSku = () => `CF-${nano()}`;

export const generateQRCode = async (sku: string) => {
  const qrPng = await QRCode.toBuffer(`${env.APP_URL}/inventory/sku/${sku}`, {
    width: 400,
    margin: 1,
  });
  const qr = await uploadToCloudinary(qrPng, {
    folder: "coreflow/qr",
    public_id: `qr_${sku}`,
  });

  return qr.secure_url;
};

export const toThumbnail = (url = "") =>
  url.replace("/upload/", "/upload/w_300,h_300,c_fill,f_auto,q_auto/");
