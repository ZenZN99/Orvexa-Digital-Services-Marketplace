import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from './schema/message.schema.js';
import { Contract } from '../contracts/schema/contract.schema.js';
import { TokenModule } from '../../infrastructure/token/token.module.js';
import { CloudinaryModule } from '../../infrastructure/cloudinary/cloudinary.module.js';
import { MessageController } from './message.controller.js';
import { MessageService } from './message.service.js';
import { User } from '../users/schema/user.schema.js';
import { NotificationModule } from '../notifications/notification.module.js';
import { MessageGateway } from '../../infrastructure/gateways/message.gateway.js';

@Module({
  imports: [
    SequelizeModule.forFeature([Message, Contract, User]),
    TokenModule,
    CloudinaryModule,
    NotificationModule,
  ],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway],
})
export class MessageModule {}
