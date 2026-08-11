import { sendResponse } from "@/utils/sendResponse";
import { Request, Response } from "express";
import * as uploadsService from "./uploads.service";
import { HttpStatusCode } from "@/types";

export const uploadAsset = async (req: Request, res: Response) => {
  const asset = req.file as Express.Multer.File;
  const uploaded = await uploadsService.uploadAsset(asset);
  sendResponse({
    res,
    statusCode: HttpStatusCode.CREATED,
    data: { urls: uploaded.secure_url },
  });
};

export const uploadAssets = async (req: Request, res: Response) => {
  const assets = (req.files as Express.Multer.File[]) ?? [];
  const uploaded = await uploadsService.uploadAssetsBulk(assets);
  sendResponse({
    res,
    statusCode: HttpStatusCode.CREATED,
    data: { urls: uploaded.map(({ secure_url }) => secure_url) },
  });
};
