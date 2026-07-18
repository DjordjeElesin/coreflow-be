import { Router } from "express";
import * as employeesController from "./employees.controller";
import { validatePayload } from "@/middleware/validate";
import { updateEmployeeSchema } from "./employees.validation";

export const employeesRouter = Router();

//GET METHODS
employeesRouter.get("/", employeesController.getEmployees);
employeesRouter.get("/:id", employeesController.getEmployee);

//POST METHODS

//PATCH METHODS
employeesRouter.patch(
  "/:id",
  validatePayload(updateEmployeeSchema),
  employeesController.updateEmployee,
);
