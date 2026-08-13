import { CustomerStatus, CustomerType, Gender } from "@/config/generated/enums";
import Joi from "joi";
import { addressSchema, TAddressPayload } from "../../users/validation/users.validation";

export type TCustomerFilters = {
  name?: string;
  email?: string;
  company?: string;
  status?: CustomerStatus;
  type?: CustomerType;
};

export type TCreateCustomerPayload = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  type: CustomerType;
  phone?: string;
  address: TAddressPayload;
  birthDate?: string;
  gender?: Gender;
  notes?: string;
};

export type TUpdateCustomerPayload = Partial<TCreateCustomerPayload>;

export const customerFiltersSchema = Joi.object<TCustomerFilters>({
  name: Joi.string().optional(),
  email: Joi.string().optional(),
  company: Joi.string().optional(),
  status: Joi.string()
    .valid(...Object.values(CustomerStatus))
    .optional(),
  type: Joi.string()
    .valid(...Object.values(CustomerType))
    .optional(),
});

export const customerFields = {
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  company: Joi.string().required(),
  type: Joi.string()
    .valid(...Object.values(CustomerType))
    .required(),
  phone: Joi.string()
    .pattern(new RegExp("^\\+?[0-9\\s\\-\\)]{7,15}$"))
    .messages({
      "string.pattern.base":
        "Please enter a valid phone number (7 to 15 digits). Numbers, spaces, dashes, and + are allowed.",
    })
    .optional(),
  address: addressSchema.optional(),
  birthDate: Joi.date().iso().optional(),
  gender: Joi.string()
    .valid(...Object.values(Gender))
    .required(),
  notes: Joi.string().optional(),
};

export const createCustomerSchema =
  Joi.object<TCreateCustomerPayload>(customerFields);

export const updateCustomerSchema = Joi.object<TUpdateCustomerPayload>(
  customerFields,
).fork(Object.keys(customerFields), (schema) => schema.optional());
