import * as employeesController from "./controllers";
import { Router } from "express";
import { validateBody, validateQuery } from "@/middleware/validate";
import {
  createEmployeeSchema,
  createLeaveRequestSchema,
  employeeFiltersSchema,
  leaveRequestFiltersSchema,
  updateEmployeeSchema,
  updateLeaveRequestSchema,
} from "./validation";
import { requireRoles } from "@/middleware/authorization";
import { Role } from "@/config/generated/enums";

const employeesRouter = Router();

//GET METHODS
employeesRouter.get(
  "/",
  validateQuery(employeeFiltersSchema),
  employeesController.getEmployees,
);
employeesRouter.get("/:id", employeesController.getEmployee);
employeesRouter.get(
  "/leave-requests",
  validateQuery(leaveRequestFiltersSchema),
  employeesController.getLeaveRequests,
);

//POST METHODS
employeesRouter.post(
  "/",
  requireRoles([Role.ADMIN, Role.MODERATOR]),
  validateBody(createEmployeeSchema),
  employeesController.createEmployee,
);

employeesRouter.post(
  "/:id/leave-requests",
  requireRoles([Role.USER, Role.ADMIN]),
  validateBody(createLeaveRequestSchema),
  employeesController.createLeaveRequest,
);

//UPDATE METHODS
employeesRouter.patch(
  "/:id",
  validateBody(updateEmployeeSchema),
  employeesController.updateEmployee,
);
employeesRouter.patch(
  "/leave-requests/:id",
  validateBody(updateLeaveRequestSchema),
  employeesController.updateLeaveRequest,
);
employeesRouter.patch(
  "/leave-requests/:id/approve",
  requireRoles([Role.ADMIN, Role.MODERATOR]),
  employeesController.updateLeaveRequest,
);

//DELETE METHODS
employeesRouter.delete("/:id", employeesController.deleteEmployee);

employeesRouter.delete(
  "/leave-requests/:id",
  employeesController.deleteLeaveRequest,
);

export default employeesRouter;
