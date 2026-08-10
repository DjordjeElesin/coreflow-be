import { EStockLevels } from "@/types";
import { TProductFilters } from "./products.validation";
import { Prisma } from "@/config/generated/client";

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
