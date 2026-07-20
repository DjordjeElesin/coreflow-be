import * as employeesController from "./employees.controller";
import { Router } from "express";
import { validatePayload } from "@/middleware/validate";
import { updateEmployeeSchema } from "./employees.validation";
import { requireRoles } from "@/middleware/authorizaton";
import { Role } from "@/config/generated/enums";

const employeesRouter = Router();

//GET METHODS
employeesRouter.get("/", employeesController.getEmployees);
employeesRouter.get("/:id", employeesController.getEmployee);

//POST METHODS

//PATCH METHODS
employeesRouter.patch(
  "/:id",
  requireRoles([Role.ADMIN, Role.MODERATOR]),
  validatePayload(updateEmployeeSchema),
  employeesController.updateEmployee,
);

export default employeesRouter;
