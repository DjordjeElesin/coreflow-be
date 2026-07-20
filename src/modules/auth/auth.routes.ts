import * as authController from "./auth.controller";
import { Router } from "express";
import { requireAuth } from "@/middleware/authorizaton";
import { validatePayload } from "@/middleware/validate";
import { loginSchema } from "./auth.validation";

const authRouter = Router();

authRouter.post("/login", validatePayload(loginSchema), authController.login);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/logout", authController.logout);
authRouter.get("/me", requireAuth, authController.getMe);

export default authRouter;
