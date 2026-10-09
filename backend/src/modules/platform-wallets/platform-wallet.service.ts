import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { PlatformWallet } from './schema/platform-wallet.schema.js';
import { User } from '../users/schema/user.schema.js';
import { UserRole } from '../../common/enums/user.enum.js';
import { response } from '../../common/libs/response.js';
import { messages } from '../../common/libs/messages.js';

@Injectable()
export class PlatformWalletService {
  constructor(
    @InjectModel(PlatformWallet)
    private readonly platformWalletModel: typeof PlatformWallet,

    @InjectModel(User)
    private readonly userModel: typeof User,

    private readonly sequelize: Sequelize,
  ) {}

  async findBalance() {
    const wallet = await this.platformWalletModel.findOne();

    if (!wallet) {
      throw new NotFoundException(messages.platformWallet.notFound);
    }

    return response(
      {
        balance: Number(wallet.balance),
      },
      null,
    );
  }

  // Withdraw money from the platform wallet and transfer it to an admin account.

  async withdraw(adminId: string, amount: number) {
    const transaction = await this.sequelize.transaction();

    try {
      // 1. Lock the platform wallet
      const wallet = await this.platformWalletModel.findOne({
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!wallet) {
        throw new NotFoundException(messages.platformWallet.notFound);
      }

      // 2. Make sure the target user is an admin
      const admin = await this.userModel.findOne({
        where: {
          id: adminId,
          role: UserRole.ADMIN,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!admin) {
        throw new NotFoundException(messages.user.adminNotFound);
      }

      const walletBalance = Number(wallet.balance);

      // 3. Check platform balance
      if (walletBalance < amount) {
        throw new BadRequestException(
          messages.platformWallet.withdraw.insufficientBalance,
        );
      }

      // 4. Withdraw from platform
      wallet.balance = walletBalance - amount;

      await wallet.save({
        transaction,
      });

      // 5. Add money to admin balance
      admin.balance = Number(admin.balance) + amount;

      await admin.save({
        transaction,
      });

      // 6. Commit
      await transaction.commit();

      return response(
        {
          amount,
          platformBalance: Number(wallet.balance),
          adminBalance: Number(admin.balance),
        },
        messages.platformWallet.withdraw.success,
      );
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
