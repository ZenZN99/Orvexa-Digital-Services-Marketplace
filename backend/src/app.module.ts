import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { CartModule } from './modules/carts/cart.module.js';
import { ContractModule } from './modules/contracts/contract.module.js';
import { MessageModule } from './modules/messages/message.module.js';
import { NotificationModule } from './modules/notifications/notification.module.js';
import { OrderModule } from './modules/orders/order.module.js';
import { PaymentModule } from './modules/payments/payment.module.js';
import { PlatformWalletModule } from './modules/platform-wallets/platform-wallet.module.js';
import { FreelancerModule } from './modules/profiles/freelancer/freelancer.module.js';
import { UserProfileModule } from './modules/profiles/user-profiles/user-profile.module.js';
import { ReviewModule } from './modules/reviews/review.module.js';
import { ServiceModule } from './modules/services/service.module.js';
import { SupportConversationModule } from './modules/supports/coversations/support-conversation.module.js';
import { SupportMessageModule } from './modules/supports/messages/support-message.module.js';
import { UserVerificationModule } from './modules/user-verifications/user-verification.module.js';
import { UserModule } from './modules/users/user.module.js';
import { NotificationGateway } from './infrastructure/gateways/notification.gateway.js';
import { TokenModule } from './infrastructure/token/token.module.js';
import { RedisModule } from './infrastructure/database/redis/redis.module.js';
import { BullMQModule } from './infrastructure/database/bullmq/bullmq.module.js';
import { MessageGateway } from './infrastructure/gateways/message.gateway.js';
import { CloudinaryModule } from './infrastructure/cloudinary/cloudinary.module.js';
import { NotificationSocketGateway } from './infrastructure/gateways/notification-socket.gateway.js';
import { PresenceGateway } from './infrastructure/gateways/presence.gateway.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',

        host: configService.getOrThrow<string>('DB_HOST'),
        port: Number(configService.getOrThrow<string>('DB_PORT')),
        username: configService.getOrThrow<string>('DB_USERNAME'),
        password: configService.getOrThrow<string>('DB_PASSWORD'),
        database: configService.getOrThrow<string>('DB_NAME'),

        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },

        autoLoadModels: true,
        synchronize: false,
      }),
    }),

    AuthModule,
    CartModule,
    ContractModule,
    MessageModule,
    NotificationModule,
    OrderModule,
    PaymentModule,
    PlatformWalletModule,
    FreelancerModule,
    UserProfileModule,
    ReviewModule,
    ServiceModule,
    SupportConversationModule,
    SupportMessageModule,
    UserVerificationModule,
    UserModule,
    TokenModule,
    RedisModule,
    BullMQModule,
    CloudinaryModule,
  ],

  controllers: [AppController],

  providers: [
    AppService,
    NotificationGateway,
    NotificationSocketGateway,
    MessageGateway,
    PresenceGateway,
  ],
})
export class AppModule {}
