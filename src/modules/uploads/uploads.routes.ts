import upload from "@/config/fileUploads/multer";
import { Router } from "express";
import * as uploadsController from "./uploads.controller";

const uploadsRouter = Router();

uploadsRouter.post("/", upload.single("assets"), uploadsController.uploadAsset);
uploadsRouter.post(
  "/bulk",
  upload.array("assets", 8),
  uploadsController.uploadAssets,
);

export default uploadsRouter;
