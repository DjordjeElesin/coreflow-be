import { Router } from "express";
import { getUsers } from "./users.controller";

const userRouter = Router();

userRouter.get("/", getUsers);

export default userRouter;
