import { Router } from "express";
import * as departmentsController from "./departments.controller";

const departmentsRouter = Router();

departmentsRouter.get("/", departmentsController.getDepartments);

export default departmentsRouter;
