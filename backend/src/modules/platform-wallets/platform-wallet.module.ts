import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PlatformWallet } from './schema/platform-wallet.schema.js';
import { User } from '../users/schema/user.schema.js';
import { TokenModule } from '../../infrastructure/token/token.module.js';
import { PlatformWalletController } from './platform-wallet.controller.js';
import { PlatformWalletService } from './platform-wallet.service.js';
import { UserVerification } from '../user-verifications/schema/user-verification.schema.js';

@Module({
  imports: [
    SequelizeModule.forFeature([PlatformWallet, User, UserVerification]),
    TokenModule,
  ],
  controllers: [PlatformWalletController],
  providers: [PlatformWalletService],
})
export class PlatformWalletModule {}
