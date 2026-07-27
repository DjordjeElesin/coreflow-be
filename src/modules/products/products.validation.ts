import { Prisma } from "@/config/generated/client";
import { TStockLevels } from "@/types";
import Joi from "joi";

export type TProductFilters = {
  name?: string;
  brand?: string;
  categoryId?: number;
  stock?: TStockLevels;
  sortBy: "name" | "brand" | "category" | "stock";
  sortOrder: "desc" | "asc";
};

export type TUpdateProductPayload = Prisma.ProductUncheckedUpdateInput;

export const productInclude = {
  category: true,
} satisfies Prisma.ProductInclude;

export const productFiltersSchema = Joi.object<TProductFilters>({
  name: Joi.string().optional(),
  brand: Joi.string().optional(),
  categoryId: Joi.number().optional(),
  stock: Joi.string()
    .valid(...Object.values(TStockLevels))
    .optional(),
  sortBy: Joi.string()
    .valid("name", "brand", "category", "stock")
    .optional()
    .default("name"),
  sortOrder: Joi.string().valid("desc", "asc").optional().default("asc"),
});

export const updateProductSchema = Joi.object<TUpdateProductPayload>({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  brand: Joi.string().optional(),
  categoryId: Joi.number().optional(),
  stock: Joi.number().min(0).optional(),
  price: Joi.number().min(0).optional(),
  discountPercentage: Joi.number().min(0).max(100).optional(),
  warrantyInformation: Joi.string().optional(),
  shippingInformation: Joi.string().optional(),
  returnPolicy: Joi.string().optional(),
});
