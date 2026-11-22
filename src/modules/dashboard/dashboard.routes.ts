import { Router } from "express";
import * as dashboardController from "./controllers";
import { validateQuery } from "@/middleware";
import {
  revenueTrendParamsSchema,
  topCustomersParamsSchema,
  topProductsParamsSchema,
} from "./validation/dashboard.validation";
import { requireRoles } from "@/middleware/authorization";
import { Role } from "@/config/generated/enums";

const dashboardRouter = Router();

dashboardRouter.get("/summary", dashboardController.getSummary);
dashboardRouter.get(
  "/top-products",
  validateQuery(topProductsParamsSchema),
  dashboardController.getTopProducts,
);

dashboardRouter.get(
  "/top-customers",
  validateQuery(topCustomersParamsSchema),
  dashboardController.getTopCustomers,
);

dashboardRouter.get(
  "/revenue-trend",
  requireRoles([Role.ADMIN, Role.MODERATOR]),
  validateQuery(revenueTrendParamsSchema),
  dashboardController.getRevenueTrend,
);

export default dashboardRouter;
