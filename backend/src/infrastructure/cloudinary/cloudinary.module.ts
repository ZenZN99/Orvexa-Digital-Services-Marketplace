import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

import { CloudinaryService } from './cloudinary.service.js';

@Module({
  imports: [ConfigModule],

  providers: [
    {
      // Configures Cloudinary using environment variables.
      provide: 'CLOUDINARY',

      // Creates and configures the Cloudinary client.
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        cloudinary.config({
          cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
          api_key: configService.get<string>('CLOUDINARY_API_KEY'),
          api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
        });

        // Returns the configured Cloudinary client.
        return cloudinary;
      },
    },

    CloudinaryService,
  ],

  exports: [CloudinaryService],
})
export class CloudinaryModule {}
