import { Prisma } from "@/config/generated/client";
import { ContractType, Gender } from "@/config/generated/enums";
import { employeeSelect } from "@/modules/employees/employees.service";

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


