import * as usersService from "./users.service";
import { Request, Response } from "express";
import {
  validateIdParam,
  validateJoiSchema,
} from "@/utils/validationUtils/validationUtils";
import { userFiltersSchema } from "./users.validation";
import { BadRequestError } from "@/errors";
import { sendResponse } from "@/utils/sendResponse";
import { HttpStatusCode } from "@/types";
import { getCurrentUser } from "@/utils/getCurrentUser";

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

  sendResponse({ res, statusCode: HttpStatusCode.OK, data: users });
};

export const getUser = async (req: Request, res: Response) => {
  const id = validateIdParam(req.params.id);
  const user = await usersService.findById(id);

  sendResponse({ res, statusCode: HttpStatusCode.OK, data: user });
};

export const createUser = async (req: Request, res: Response) => {
  const user = await usersService.post(req.body);
  sendResponse({ res, statusCode: HttpStatusCode.CREATED, data: user });
};

export const updateUser = async (req: Request, res: Response) => {
  const id = validateIdParam(req.params.id);
  const currentUser = getCurrentUser(req);
  const user = await usersService.update(id, req.body, currentUser);

  sendResponse({ res, statusCode: HttpStatusCode.OK, data: user });
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = validateIdParam(req.params.id);
  await usersService.deleteUser(id);

  sendResponse({ res, statusCode: HttpStatusCode.NO_CONTENT });
};

export const changeUserPassword = async (req: Request, res: Response) => {
  const id = validateIdParam(req.params.id);
  const currentUser = getCurrentUser(req);

  await usersService.changePassword(id, req.body, currentUser);

  sendResponse({
    res,
    statusCode: HttpStatusCode.OK,
    message: "Password changed successfully.",
  });
};
