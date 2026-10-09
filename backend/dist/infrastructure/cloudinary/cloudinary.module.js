var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryService } from './cloudinary.service.js';
let CloudinaryModule = class CloudinaryModule {
};
CloudinaryModule = __decorate([
    Module({
        imports: [ConfigModule],
        providers: [
            {
                provide: 'CLOUDINARY',
                inject: [ConfigService],
                useFactory: (configService) => {
                    cloudinary.config({
                        cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
                        api_key: configService.get('CLOUDINARY_API_KEY'),
                        api_secret: configService.get('CLOUDINARY_API_SECRET'),
                    });
                    return cloudinary;
                },
            },
            CloudinaryService,
        ],
        exports: [CloudinaryService],
    })
], CloudinaryModule);
export { CloudinaryModule };
//# sourceMappingURL=cloudinary.module.js.map