import { Router } from "express";
import usersRouter from "./users/users.routes";
import { employeesRouter } from "./employees/employees.routes";

const router = Router();

router.use("/users", usersRouter);
router.use("/employees", employeesRouter);

export default router;
