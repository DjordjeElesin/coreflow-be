import { Prisma } from "@/config/generated/client";
import {
  TCreateUserPayload,
  TUserFilters,
} from "../validation/users.validation";
import { findUniqueByEmail } from "../../auth/services/auth.service";
import { ConflictError } from "@/errors";
import bcrypt from "bcrypt";

export const buildUserWhereClause = (
  filters: TUserFilters,
): Prisma.UserWhereInput => {
  const { search, role, gender, city, country, state, street } = filters;

  const hasAddressFilter = Boolean(city || country || state || street);
  const addressFilter: Prisma.AddressWhereInput = {
    city: city ? { contains: city, mode: "insensitive" } : undefined,
    country: country ? { contains: country, mode: "insensitive" } : undefined,
    state: state ? { contains: state, mode: "insensitive" } : undefined,
    street: street ? { contains: street, mode: "insensitive" } : undefined,
  };

  return {
    ...(search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
    deletedAt: null,
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
