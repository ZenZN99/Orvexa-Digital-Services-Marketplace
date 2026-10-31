import { v2 as cloudinary } from "cloudinary";
import { Readable } from "node:stream";
import { CloudinaryConfig } from "./cloudinary-config";

export interface UploadedImage {
  url: string;
  publicId: string;
}

CloudinaryConfig.configure();

export class CloudinaryManager {
  async upload(file: File, folder: string): Promise<UploadedImage> {
    const buffer = Buffer.from(await file.arrayBuffer());

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: "image" },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          if (!result) {
            reject(new Error("Cloudinary upload failed"));
            return;
          }

          resolve({ url: result.secure_url, publicId: result.public_id });
        },
      );

      Readable.from(buffer).pipe(stream);
    });
  }

  async destroy(publicId: string): Promise<void> {
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok" && result.result !== "not found") {
      throw new Error("Cloudinary image deletion failed");
    }
  }
}
