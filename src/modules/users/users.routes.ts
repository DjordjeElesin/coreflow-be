import { Router } from "express";
import * as usersController from "./controllers";
import { validatePayload } from "@/middleware/validate";
import {
  changePasswordSchema,
  createUserSchema,
  updateUserSchema,
} from "./validation/users.validation";
import { requireRoles } from "@/middleware/authorizaton";
import { Role } from "@/config/generated/enums";
import upload from "@/config/multer";

const usersRouter = Router();

//GET METHODS
usersRouter.get(
  "/",
  requireRoles([Role.ADMIN, Role.MODERATOR]),
  usersController.getUsers,
);
usersRouter.get(
  "/:id",
  requireRoles([Role.ADMIN, Role.MODERATOR]),
  usersController.getUser,
);

//POST METHODS
usersRouter.post(
  "/",
  requireRoles([Role.ADMIN]),
  validatePayload(createUserSchema),
  usersController.createUser,
);
usersRouter.post(
  "/:id/profile-image",
  upload.single("avatar"),
  usersController.changeUserProfileImage,
);

//UPDATE METHODS
usersRouter.patch(
  "/:id",
  requireRoles([Role.ADMIN]),
  validatePayload(updateUserSchema),
  usersController.updateUser,
);
usersRouter.patch(
  "/:id/change-password",
  validatePayload(changePasswordSchema),
  usersController.changeUserPassword,
);

//DELETE METHODS
usersRouter.delete(
  "/:id",
  requireRoles([Role.ADMIN]),
  usersController.deleteUser,
);

export default usersRouter;
