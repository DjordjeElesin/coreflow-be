import { findAllUsers } from "./users.service";
import { Request, Response } from "express";

export const getUsers = async (req: Request, res: Response) => {
  const users = await findAllUsers();
  res.json(users);
};
