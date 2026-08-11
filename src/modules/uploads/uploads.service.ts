import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import type { UploadApiOptions } from "cloudinary";

export const uploadAsset = async (
  asset: Express.Multer.File,
  options?: UploadApiOptions,
) => {
  const uploaded = await uploadToCloudinary(asset.buffer, options ?? {});
  return uploaded;
};

export const uploadAssetsBulk = async (
  assets: Express.Multer.File[],
  options?: UploadApiOptions,
) => {
  options;
  const uploaded = await Promise.all(
    assets.map((item) => uploadToCloudinary(item.buffer, options ?? {})),
  );
  return uploaded;
};
