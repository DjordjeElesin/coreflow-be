import { Prisma } from "@/config/generated/client";
import { Role } from "@/config/generated/enums";
import { employeeSelect } from "@/modules/employees/DTOs/employees.DTO";
import { orderDetailsSelect, orderSelect } from "@/modules/orders/orders.DTO";

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER = 500,
}

export enum ESortOrder {
  ASC = "asc",
  DESC = "desc",
}

export type TLoginPayload = {
  email: string;
  password: string;
};

export type TAuthUser = {
  id: number;
  role: Role;
};

export type TAddress = {
  id: number;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  lat: number | null;
  lng: number | null;
};

export type TEmployeeDbOutput = Prisma.EmployeeGetPayload<{
  select: typeof employeeSelect;
}>;

export type TUserFields = TEmployeeDbOutput["user"];
export type TEmployeeDTO = Omit<TEmployeeDbOutput, "user"> & TUserFields;

export enum EStockLevels {
  IN_STOCK = "in-stock",
  LOW_STOCK = "low-stock",
  ALMOST_SOLD_OUT = "almost-sold-out",
  OUT_OF_STOCK = "out-of-stock",
}

export type TOrderDbOutput = Prisma.OrderGetPayload<{
  select: typeof orderSelect;
}>;
export type TOrderDetailsDbOutput = Prisma.OrderGetPayload<{
  select: typeof orderDetailsSelect;
}>;

export type TOrderDTO = Omit<TOrderDbOutput, "orderItems"> & {
  discountedTotal: number;
};
export type TOrderDetailsDTO = TOrderDbOutput & {
  discountedTotal: number;
};
