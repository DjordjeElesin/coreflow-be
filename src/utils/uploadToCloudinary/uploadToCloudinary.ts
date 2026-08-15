import type { UploadApiOptions, UploadApiResponse } from "cloudinary";
import cloudinary from "@/config/fileUploads/cloudinary";

export const uploadToCloudinary = (buffer: Buffer, options: UploadApiOptions) =>
  new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err || !result) return reject(err);
      resolve(result);
    });
    stream.end(buffer);
  });
