import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SupportMessage } from './schema/support-message.schema.js';
import { SupportConversation } from '../coversations/schema/support-conversation.schema.js';
import { TokenModule } from '../../../infrastructure/token/token.module.js';
import { CloudinaryModule } from '../../../infrastructure/cloudinary/cloudinary.module.js';
import { SupportMessageController } from './support-message.controller.js';
import { SupportMessageService } from './support-message.service.js';
import { User } from '../../users/schema/user.schema.js';

@Module({
  imports: [
    SequelizeModule.forFeature([SupportMessage, SupportConversation, User]),
    TokenModule,
    CloudinaryModule,
  ],
  controllers: [SupportMessageController],
  providers: [SupportMessageService],
})
export class SupportMessageModule {}
