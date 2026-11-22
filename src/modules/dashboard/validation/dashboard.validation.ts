import Joi from "joi";

export type TBaseKpiParams = {
  startDate?: string;
  endDate?: string;
};

export const baseKpiParamsSchema = Joi.object<TBaseKpiParams>({
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
});

export type TTopCustomersParams = TBaseKpiParams;
export const topCustomersParamsSchema = baseKpiParamsSchema;

export type TTopProductsParams = TBaseKpiParams & { categoryId?: number };
export const topProductsParamsSchema = Joi.object<TRevenueTrendParams>({
  categoryId: Joi.number().optional(),
}).concat(baseKpiParamsSchema);

export type TRevenueTrendParams = TBaseKpiParams & { categoryId?: number };
export const revenueTrendParamsSchema = Joi.object<TRevenueTrendParams>({
  categoryId: Joi.number().optional(),
}).concat(baseKpiParamsSchema);
