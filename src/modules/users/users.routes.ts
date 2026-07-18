import { Router } from "express";
import * as usersController from "./users.controller";
import { validatePayload } from "@/middleware/validate";
import { createUserSchema } from "./users.validation";

const usersRouter = Router();

//GET METHODS
usersRouter.get("/", usersController.getUsers);
usersRouter.get("/:id", usersController.getUser);

//POST METHODS
usersRouter.post(
  "/",
  validatePayload(createUserSchema),
  usersController.createUser,
);

export default usersRouter;
