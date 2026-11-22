import { Router } from "express";
import * as productsController from "./controllers";
import { validateBody, validateQuery } from "@/middleware/validate";
import {
  createProductSchema,
  productFiltersSchema,
  updateProductSchema,
} from "./validation/products.validation";
import { requireRoles } from "@/middleware/authorization";
import { Role } from "@/config/generated/enums";

const productsRouter = Router();

//GET METHODS
productsRouter.get(
  "/",
  validateQuery(productFiltersSchema),
  productsController.getProducts,
);
productsRouter.get("/categories", productsController.getCategories);
productsRouter.get("/:id", productsController.getProductById);

//POST METHODS
productsRouter.post(
  "/",
  requireRoles([Role.ADMIN]),
  validateBody(createProductSchema),
  productsController.createProduct,
);

//PATCH METHODS
productsRouter.patch(
  "/:id",
  requireRoles([Role.ADMIN]),
  validateBody(updateProductSchema),
  productsController.updateProduct,
);

//DELETE METHODS
productsRouter.delete(
  "/:id",
  requireRoles([Role.ADMIN]),
  productsController.deleteProduct,
);

export default productsRouter;
