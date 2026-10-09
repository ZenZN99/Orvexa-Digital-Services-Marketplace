import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SupportConversation } from './schema/support-conversation.schema.js';
import { User } from '../../users/schema/user.schema.js';
import { TokenModule } from '../../../infrastructure/token/token.module.js';
import { SupportConversationController } from './support-conversation.controller.js';
import { SupportConversationService } from './support-conversation.service.js';

@Module({
  imports: [
    SequelizeModule.forFeature([SupportConversation, User]),
    TokenModule,
  ],
  controllers: [SupportConversationController],
  providers: [SupportConversationService],
})
export class SupportConversationModule {}
