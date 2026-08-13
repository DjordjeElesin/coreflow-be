import { Prisma } from "@/config/generated/client";
import { TCustomerFilters } from "../validation";

export const buildCustomersWhereClause = (
  filters: TCustomerFilters,
): Prisma.CustomerWhereInput => {
  const { name, company, email, ...rest } = filters;

  return {
    ...rest,
    ...(name
      ? {
          OR: [
            { firstName: { contains: name, mode: "insensitive" } },
            { lastName: { contains: name, mode: "insensitive" } },
          ],
        }
      : {}),
    email: email ? { contains: email, mode: "insensitive" } : undefined,
    company: company ? { contains: company, mode: "insensitive" } : undefined,
  };
};
