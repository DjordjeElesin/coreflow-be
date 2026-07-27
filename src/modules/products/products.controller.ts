import { Request, Response } from "express";
import * as productsService from "./products.service";
import { sendResponse } from "@/utils/sendResponse";
import { HttpStatusCode } from "@/types";
import { validateIdParam, validateJoiSchema } from "@/utils/validationUtils";
import { productFiltersSchema } from "./products.validation";

export const getProducts = async (req: Request, res: Response) => {
  const filters = validateJoiSchema(productFiltersSchema, req.query);
  const products = await productsService.find(filters);

  sendResponse({ res, statusCode: HttpStatusCode.OK, data: products });
};

export const getProductById = async (req: Request, res: Response) => {
  const id = validateIdParam(req.params.id);
  const product = await productsService.findById(id);

  sendResponse({ res, statusCode: HttpStatusCode.OK, data: product });
};

export const updateProduct = async (req: Request, res: Response) => {
  const id = validateIdParam(req.params.id);
  const updated = await productsService.update(id, req.body);

  sendResponse({ res, statusCode: HttpStatusCode.OK, data: updated });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = validateIdParam(req.params.id);
  await productsService.deleteProduct(id);

  sendResponse({
    res,
    statusCode: HttpStatusCode.NO_CONTENT,
    message: "Product deleted successfully.",
  });
};
