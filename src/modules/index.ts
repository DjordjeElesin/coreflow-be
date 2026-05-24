import { Router } from "express";
import userRouter from "./users/users.routes";

const router = Router();

router.use("/users", userRouter);

export default router;
