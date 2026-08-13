import prisma from "@/config/database";
import { Prisma } from "@/config/generated/client";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "@/errors";
import {
  TChangePasswordPayload,
  TCreateUserPayload,
  TUpdateUserPayload,
  TUserFilters,
  USER_EDITABLE_FIELDS_BY_ROLE,
} from "../validation";
import { buildUserCreateData, buildUserWhereClause } from "../utils";
import { assertEditableFieldsAccess } from "@/utils/assertEditableFieldsAccess";
import { TAuthUser } from "@/types";
import bcrypt from "bcrypt";
import { ERROR_MSGS } from "@/constants";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";

const userArgs = {
  omit: { password: true, addressId: true, deletedAt: true, updatedAt: true },
  include: { address: true },
} satisfies Prisma.UserDefaultArgs;

export const find = async (filters: TUserFilters) =>
  prisma.user.findMany({ where: buildUserWhereClause(filters), ...userArgs });

export const findById = async (id: number) => {
  const user = await prisma.user.findFirst({
    where: { id, deletedAt: null },
    ...userArgs,
  });
  if (!user) throw new NotFoundError(`User with ID:${id} not found.`);
  return user;
};

export const create = async (user: TCreateUserPayload) =>
  prisma.user.create({
    data: await buildUserCreateData(user),
    ...userArgs,
  });

export const update = async (
  id: number,
  user: TUpdateUserPayload,
  currentUser: TAuthUser,
) => {
  assertEditableFieldsAccess(
    USER_EDITABLE_FIELDS_BY_ROLE,
    user,
    currentUser.role,
  );

  const { address, ...rest } = user;
  const updatedUser = await prisma.user.update({
    where: { id, deletedAt: null },
    data: {
      ...rest,
      address: address && {
        upsert: {
          create: address,
          update: address,
        },
      },
    },
  });
  return updatedUser;
};

export const deleteUser = async (id: number) =>
  prisma.user.update({
    where: { id },
    data: { deletedAt: new Date().toISOString() },
  });

export const changePassword = async (
  id: number,
  payload: TChangePasswordPayload,
  currentUser: TAuthUser,
) => {
  if (id !== currentUser.id)
    throw new ForbiddenError(ERROR_MSGS.no_permission_action);

  const user = await prisma.user.findFirst({ where: { id, deletedAt: null } });
  if (!user) throw new NotFoundError(`User ${id} not found`);

  const { currentPassword, newPassword } = payload;

  const isCurrentValid = await bcrypt.compare(currentPassword, user.password);
  if (!isCurrentValid)
    throw new BadRequestError("Current password is incorrect");

  await prisma.user.update({
    where: { id, deletedAt: null },
    data: { password: await bcrypt.hash(newPassword, 10) },
  });
};

export const changeProfileImage = async (
  id: number,
  currentUser: TAuthUser,
  fileBuffer?: Buffer,
) => {
  const user = await prisma.user.findFirst({ where: { id } });

  if (!user) throw new NotFoundError(`User with ID:${id} not found.`);
  if (currentUser.id !== user.id)
    throw new UnauthorizedError(ERROR_MSGS.no_permission_action);

  if (!fileBuffer) throw new BadRequestError("No file provided");
  const uploaded = await uploadToCloudinary(fileBuffer, {
    folder: "coreflow/avatars",
    transformation: [
      { width: 630, height: 630, crop: "fill", gravity: "face" },
    ],
  });

  const updated = await prisma.user.update({
    where: { id },
    data: { profileImage: uploaded.secure_url },
  });

  return updated;
};
