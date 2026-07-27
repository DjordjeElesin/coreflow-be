import { Prisma } from "@/config/generated/client";
import { TCreateUserPayload, TUserFilters } from "./users.validation";
import { findUniqueByEmail } from "../auth/auth.service";
import { ConflictError } from "@/errors";
import bcrypt from "bcrypt";

export const buildUserWhere = (
  filters: TUserFilters,
): Prisma.UserWhereInput => {
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

export const buildUserCreateData = async ({
  address,
  password,
  ...user
}: TCreateUserPayload): Promise<Prisma.UserCreateInput> => {
  const existing = await findUniqueByEmail(user.email);
  if (existing) throw new ConflictError("Email already in use");

  return {
    ...user,
    password: await bcrypt.hash(password, 10),
    address: address && { create: address },
  };
};
