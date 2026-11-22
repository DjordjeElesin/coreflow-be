import { Router } from "express";
import usersRouter from "./users/users.routes";
import employeesRouter from "./employees/employees.routes";
import authRouter from "./auth/auth.routes";
import { requireAuth } from "@/middleware/authorization";
import productsRouter from "./products/products.routes";
import ordersRouter from "./orders/orders.routes";
import uploadsRouter from "./uploads/uploads.routes";
import customersRouter from "./customers/customers.routes";
import dashboardRouter from "./dashboard/dashboard.routes";
import departmentsRouter from "./departments/departments.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/upload", requireAuth, uploadsRouter);
router.use("/users", requireAuth, usersRouter);
router.use("/employees", requireAuth, employeesRouter);
router.use("/departments", requireAuth, departmentsRouter);
router.use("/products", requireAuth, productsRouter);
router.use("/orders", requireAuth, ordersRouter);
router.use("/customers", requireAuth, customersRouter);
router.use("/dashboard", requireAuth, dashboardRouter);

export default router;
