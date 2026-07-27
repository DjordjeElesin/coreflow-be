import { Prisma } from "@/config/generated/client";
import { Role } from "@/config/generated/enums";
import { employeeSelect } from "@/modules/employees/employees.DTO";

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

export type TLoginPayload = {
  email: string;
  password: string;
};

// Shape of the JWT payload / req.user
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
export type TEmployeeResponseDTO = Omit<TEmployeeDbOutput, "user"> &
  TUserFields;

export enum TStockLevels {
  IN_STOCK = "in-stock",
  LOW_STOCK = "low-stock",
  ALMOST_SOLD_OUT = "almost-sold-out",
  OUT_OF_STOCK = "out-of-stock",
}
