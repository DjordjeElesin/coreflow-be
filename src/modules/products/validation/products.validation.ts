import { Prisma } from "@/config/generated/client";
import { ESortOrder, EStockLevels } from "@/types";
import Joi from "joi";

export type TProductFilters = {
  name?: string;
  brand?: string;
  categoryId?: number;
  stock?: EStockLevels;
  sortBy: "name" | "brand" | "category" | "stock";
  sortOrder: ESortOrder;
};

export type TCreateProductPayload = {
  name: string;
  description: string;
  price: number;
  discountPercentage?: number;
  stock: number;
  brand: string;
  categoryId: number;
  images: string[];
  warrantyInformation?: string;
  shippingInformation?: string;
  returnPolicy?: string;
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
    .valid(...Object.values(EStockLevels))
    .optional(),
  sortBy: Joi.string()
    .valid("name", "brand", "category", "stock")
    .optional()
    .default("name"),
  sortOrder: Joi.string()
    .valid(...Object.values(ESortOrder))
    .optional()
    .default("asc"),
});

export const createProductSchema = Joi.object<TCreateProductPayload>({
  name: Joi.string().trim().min(2).max(200).required(),
  description: Joi.string().trim().max(2000).required(),
  price: Joi.number().min(0).required(),
  discountPercentage: Joi.number().min(0).max(100).default(0),
  stock: Joi.number().integer().min(0).default(0),
  brand: Joi.string().trim().max(120).default("Unknown"),
  categoryId: Joi.number().integer().positive().required(),
  images: Joi.array().items(Joi.string().uri()).max(8).default([]),
  warrantyInformation: Joi.string().trim().allow("").default(""),
  shippingInformation: Joi.string().trim().allow("").default(""),
  returnPolicy: Joi.string().trim().allow("").default(""),
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
