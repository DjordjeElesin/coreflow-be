import * as usersService from "./users.service";
import { Request, Response } from "express";
import { validateIdParam, validateJoiSchema } from "@/utils/validationUtils";
import { userFiltersSchema } from "./users.validation";
import { BadRequestError } from "@/errors";

export const getUsers = async (req: Request, res: Response) => {
  const { error, value: filters } = validateJoiSchema(
    userFiltersSchema,
    req.query,
  );

  if (error) {
    const message = error.details.map(({ message }) => message).join(",\n");
    throw new BadRequestError(message);
  }
  const users = await usersService.find(filters);

  res.status(200).json(users);
};

export const getUser = async (req: Request, res: Response) => {
  const id = validateIdParam(req.params.id);
  const user = await usersService.findById(id);

  res.status(200).json(user);
};

export const createUser = async (req: Request, res: Response) => {
  const user = usersService.post(req.body);
  res.status(201).json(user);
};
