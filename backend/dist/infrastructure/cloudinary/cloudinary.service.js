var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
import cloudinary from 'cloudinary';
import streamifier from 'streamifier';
let CloudinaryService = class CloudinaryService {
    async upload(file, folder) {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.v2.uploader.upload_stream({
                folder,
            }, (error, result) => {
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
            });
            streamifier.createReadStream(file.buffer).pipe(stream);
        });
    }
    async destroy(publicId) {
        await cloudinary.v2.uploader.destroy(publicId);
    }
};
CloudinaryService = __decorate([
    Injectable()
], CloudinaryService);
export { CloudinaryService };
//# sourceMappingURL=cloudinary.service.js.map