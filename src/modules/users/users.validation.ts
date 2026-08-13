import Joi from "joi";
import { Gender, Role } from "@/config/generated/enums";
import { Prisma } from "@/config/generated/client";
import omit from "lodash/omit";

export type TUserFilters = {
  name?: string
  email?: string;
  role?: Role;
  gender?: Gender;
  city?: string;
  country?: string;
  state?: string;
  street?: string;
};

export type TAddressPayload = Pick<
  Prisma.AddressCreateInput,
  "street" | "city" | "state" | "country" | "postalCode" | "lat" | "lng"
>;

export type TCreateUserPayload = Pick<
  Prisma.UserCreateInput,
  | "firstName"
  | "lastName"
  | "email"
  | "username"
  | "password"
  | "phone"
  | "birthDate"
  | "education"
> & {
  gender: Gender;
  role: Role;
  address?: TAddressPayload;
};

export type TUpdateUserPayload = Partial<TCreateUserPayload>;

export type TChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export const userFiltersSchema = Joi.object<TUserFilters>({
  name: Joi.string().optional(),
  role: Joi.string()
    .valid(...Object.values(Role))
    .optional(),
  gender: Joi.string()
    .valid(...Object.values(Gender))
    .optional(),
  city: Joi.string().optional(),
  country: Joi.string().optional(),
  state: Joi.string().optional(),
  street: Joi.string().optional(),
});

export const addressSchema = Joi.object<Prisma.AddressCreateInput>({
  street: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required(),
  postalCode: Joi.string().required(),
  lat: Joi.number().min(-90).max(90).optional(),
  lng: Joi.number().min(-180).max(180).optional(),
});

export const userFields = {
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
    }),
  gender: Joi.string()
    .valid(...Object.values(Gender))
    .required(),
  role: Joi.string()
    .valid(...Object.values(Role))
    .required(),
  phone: Joi.string()
    .pattern(new RegExp("^\\+?[0-9\\s\\-\\)]{7,15}$"))
    .messages({
      "string.pattern.base":
        "Please enter a valid phone number (7 to 15 digits). Numbers, spaces, dashes, and + are allowed.",
    })
    .optional(),
  birthDate: Joi.date().iso().optional(),
  education: Joi.string().optional(),
  address: addressSchema.optional(),
};

export const createUserSchema = Joi.object<TCreateUserPayload>(userFields);

export const updateUserSchema = Joi.object<TUpdateUserPayload>(
  omit(userFields, "password"),
).fork(Object.keys(omit(userFields, "password")), (schema) =>
  schema.optional(),
);

export const changePasswordSchema = Joi.object<TChangePasswordPayload>({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .max(30)
    .pattern(new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
    }),
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref("newPassword"))
    .messages({
      "any.only": "Confirm password must match new password.",
    }),
});

export const USER_EDITABLE_FIELDS_BY_ROLE: Record<
  Role,
  (keyof TUpdateUserPayload)[] | "*"
> = {
  [Role.ADMIN]: "*",
  [Role.MODERATOR]: ["firstName", "lastName", "education"],
  [Role.USER]: ["phone", "address", "username"],
} as const;
