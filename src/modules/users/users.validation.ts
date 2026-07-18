import Joi from "joi";
import { Gender, Role } from "@/config/generated/enums";

export type TUserFilters = {
  email?: string;
  role?: Role;
  gender?: Gender;
  city?: string;
  country?: string;
  state?: string;
  street?: string;
};

export const userFiltersSchema = Joi.object<TUserFilters>({
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

export const createUserSchema = Joi.object({
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
    })
    .required(),
  gender: Joi.string()
    .valid(...Object.values(Gender))
    .required(),
  role: Joi.string()
    .valid(...Object.values(Role))
    .required(),
  phone: Joi.string()
    .pattern(new RegExp("^\\+?[0-9\\s\\-\\)]{7,15}$"))
    .required()
    .messages({
      "string.pattern.base":
        "Please enter a valid phone number (7 to 15 digits). Numbers, spaces, dashes, and + are allowed.",
    })
    .optional(),
  birthDate: Joi.date().iso().optional(),
  education: Joi.string().optional(),
});
