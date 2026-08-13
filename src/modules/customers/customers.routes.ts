import { Router } from "express";
import * as customersController from "./customers.controller";
import { validatePayload } from "@/middleware/validate";
import {
  createCustomerSchema,
  updateCustomerSchema,
} from "./customers.validation";
import { requireRoles } from "@/middleware/authorizaton";
import { Role } from "@/config/generated/enums";

const customersRouter = Router();

//GET METHODS
customersRouter.get("/", customersController.getCustomers);
customersRouter.get("/:id", customersController.getCustomer);
customersRouter.get("/:id/orders", customersController.getCustomerOrders);

//POST METHODS
customersRouter.post(
  "/",
  validatePayload(createCustomerSchema),
  customersController.createCustomer,
);

//PATCH METHODS
customersRouter.patch(
  "/:id",
  validatePayload(updateCustomerSchema),
  customersController.createCustomer,
);

//DELETE METHODS
customersRouter.delete(
  "/:id",
  requireRoles([Role.ADMIN, Role.MODERATOR]),
  customersController.deleteCustomer,
);

export default customersRouter;
