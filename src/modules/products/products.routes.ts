import { Router } from "express";
import * as productsController from "./controllers";
import { validatePayload } from "@/middleware/validate";
import {
  createProductSchema,
  updateProductSchema,
} from "./validation/products.validation";
import { requireRoles } from "@/middleware/authorizaton";
import { Role } from "@/config/generated/enums";

const productsRouter = Router();

//GET METHODS
productsRouter.get("/", productsController.getProducts);
productsRouter.get("/:id", productsController.getProductById);

//POST METHODS
productsRouter.post(
  "/",
  requireRoles([Role.ADMIN]),
  validatePayload(createProductSchema),
  productsController.createProduct,
);

//PATCH METHODS
productsRouter.patch(
  "/:id",
  requireRoles([Role.ADMIN]),
  validatePayload(updateProductSchema),
  productsController.updateProduct,
);

//DELETE METHODS
productsRouter.delete(
  "/:id",
  requireRoles([Role.ADMIN]),
  productsController.deleteProduct,
);

export default productsRouter;
