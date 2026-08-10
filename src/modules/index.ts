import { Router } from "express";
import usersRouter from "./users/users.routes";
import employeesRouter from "./employees/employees.routes";
import authRouter from "./auth/auth.routes";
import { requireAuth } from "@/middleware/authorizaton";
import productsRouter from "./products/products.routes";
import ordersRouter from "./orders/orders.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
router.use("/auth", authRouter);
router.use("/users", requireAuth, usersRouter);
router.use("/employees", requireAuth, employeesRouter);
router.use("/products", requireAuth, productsRouter);
router.use("/orders", requireAuth, ordersRouter);

export default router;
