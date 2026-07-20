import { Router } from "express";
import * as usersController from "./users.controller";
import { validatePayload } from "@/middleware/validate";
import { createUserSchema } from "./users.validation";
import { requireRoles } from "@/middleware/authorizaton";
import { Role } from "@/config/generated/enums";

const usersRouter = Router();

//GET METHODS
usersRouter.get("/", requireRoles([Role.ADMIN]), usersController.getUsers);
usersRouter.get("/:id", requireRoles([Role.ADMIN]), usersController.getUser);

//POST METHODS
usersRouter.post(
  "/",
  requireRoles([Role.ADMIN]),
  validatePayload(createUserSchema),
  usersController.createUser,
);

export default usersRouter;
