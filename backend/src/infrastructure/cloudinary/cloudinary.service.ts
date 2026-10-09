import { Injectable } from '@nestjs/common';
import cloudinary from 'cloudinary';
import streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  async upload(
    file: Express.Multer.File,
    folder: string,
  ): Promise<{
    url: string;
    publicId: string;
  }> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        {
          folder,
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }

          if (!result) {
            return reject(new Error('Cloudinary upload failed'));
          }

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        },
      );

      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  }

  async destroy(publicId: string): Promise<void> {
    await cloudinary.v2.uploader.destroy(publicId);
  }
}
