import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller.js';
import { NotificationService } from './notification.service.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { Notification } from './schema/notification.schema.js';
import { TokenModule } from '../../infrastructure/token/token.module.js';
import { NotificationGateway } from '../../infrastructure/gateways/notification.gateway.js';
import { NotificationSocketGateway } from '../../infrastructure/gateways/notification-socket.gateway.js';
import { User } from '../users/schema/user.schema.js';

@Module({
  imports: [SequelizeModule.forFeature([Notification, User]), TokenModule],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    NotificationGateway,
    NotificationSocketGateway,
  ],
  exports: [NotificationService, NotificationGateway],
})
export class NotificationModule {}
