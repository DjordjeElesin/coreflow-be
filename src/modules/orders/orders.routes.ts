import { Router } from "express";
import * as ordersController from "./controllers";
import { validateBody } from "@/middleware/validate";
import { createOrderSchema, orderFiltersSchema } from "./validation";

const ordersRouter = Router();

//GET METHODS
ordersRouter.get(
  "/",
  validateBody(orderFiltersSchema),
  ordersController.getOrders,
);
ordersRouter.get("/:id", ordersController.getOrderById);

//POST METHODS
ordersRouter.post(
  "/",
  validateBody(createOrderSchema),
  ordersController.createOrder,
);

//PATCH METHODS
ordersRouter.patch("/:id/confirm", ordersController.confirmOrder);
ordersRouter.patch("/:id/cancel", ordersController.cancelOrder);
ordersRouter.patch("/:id/ship", ordersController.shipOrder);
ordersRouter.patch("/:id/deliver", ordersController.deliverOrder);

//DELETE METHODS
ordersRouter.delete("/:id", ordersController.deleteOrder);

export default ordersRouter;
