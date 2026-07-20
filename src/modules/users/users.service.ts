import prisma from "@/config/database";
import { Prisma } from "@/config/generated/client";
import { ConflictError, NotFoundError } from "@/errors";
import { TUserFilters } from "./users.validation";
import { findUniqueByEmail } from "../auth/auth.service";
import bcrypt from "bcrypt";

const userArgs = {
  omit: { password: true, addressId: true, deletedAt: true, updatedAt: true },
  include: { address: true },
} satisfies Prisma.UserDefaultArgs;

const buildUserWhere = (filters: TUserFilters): Prisma.UserWhereInput => {
  const { email, role, gender, city, country, state, street } = filters;

  const hasAddressFilter = Boolean(city || country || state || street);
  const addressFilter: Prisma.AddressWhereInput = {
    city: city ? { contains: city, mode: "insensitive" } : undefined,
    country: country ? { contains: country, mode: "insensitive" } : undefined,
    state: state ? { contains: state, mode: "insensitive" } : undefined,
    street: street ? { contains: street, mode: "insensitive" } : undefined,
  };

  return {
    deletedAt: null,
    email: email ? { contains: email, mode: "insensitive" } : undefined,
    role,
    gender,
    address: hasAddressFilter ? addressFilter : undefined,
  };
};

export const find = async (filters: TUserFilters) =>
  prisma.user.findMany({ where: buildUserWhere(filters), ...userArgs });

export const findById = async (id: number) => {
  const user = await prisma.user.findFirst({
    where: { id, deletedAt: null },
    ...userArgs,
  });
  if (!user) throw new NotFoundError(`User ${id} not found`);
  return user;
};

export const post = async (user: Prisma.UserUncheckedCreateInput) => {
  const existing = await findUniqueByEmail(user.email);
  if (existing) throw new ConflictError("Email already in use");

  const hashedPassword = await bcrypt.hash(user.password, 10);

  const newUser = await prisma.user.create({
    data: { ...user, password: hashedPassword },
  });
  return newUser;
};
