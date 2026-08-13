import * as employeesController from "./controllers";
import { Router } from "express";
import { validatePayload } from "@/middleware/validate";
import {
  createEmployeeSchema,
  createLeaveRequestSchema,
  updateEmployeeSchema,
  updateLeaveRequestSchema,
} from "./validation";
import { requireRoles } from "@/middleware/authorizaton";
import { Role } from "@/config/generated/enums";

const employeesRouter = Router();

//GET METHODS
employeesRouter.get("/", employeesController.getEmployees);
employeesRouter.get("/:id", employeesController.getEmployee);

//POST METHODS
employeesRouter.post(
  "/",
  requireRoles([Role.ADMIN, Role.MODERATOR]),
  validatePayload(createEmployeeSchema),
  employeesController.createEmployee,
);

employeesRouter.post(
  "/:id/leave-request",
  requireRoles([Role.USER, Role.ADMIN]),
  validatePayload(createLeaveRequestSchema),
  employeesController.createLeaveRequest,
);

//UPDATE METHODS
employeesRouter.patch(
  "/:id",
  validatePayload(updateEmployeeSchema),
  employeesController.updateEmployee,
);
employeesRouter.patch(
  "/leave-request/:id",
  validatePayload(updateLeaveRequestSchema),
  employeesController.updateLeaveRequest,
);
employeesRouter.patch(
  "/leave-request/:id/approve",
  requireRoles([Role.ADMIN, Role.MODERATOR]),
  employeesController.updateLeaveRequest,
);

//DELETE METHODS
employeesRouter.delete("/:id", employeesController.deleteEmployee);

employeesRouter.delete(
  "/leave-request/:id",
  employeesController.deleteLeaveRequest,
);

export default employeesRouter;
