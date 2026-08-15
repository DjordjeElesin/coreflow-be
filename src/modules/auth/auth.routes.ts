import * as authController from "./controllers";
import { Router } from "express";
import { requireAuth } from "@/middleware/authorization";
import { validateBody } from "@/middleware/validate";
import { loginSchema } from "./validation";

const authRouter = Router();

authRouter.post("/login", validateBody(loginSchema), authController.login);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/logout", authController.logout);
authRouter.get("/me", requireAuth, authController.getMe);

export default authRouter;
