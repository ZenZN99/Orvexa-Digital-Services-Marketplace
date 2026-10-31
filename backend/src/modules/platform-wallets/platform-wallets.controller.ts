import { Validator, type SpongHandler } from 'riser-bob';
import type { PlatformWalletSchema } from './schemas/platform-wallet.schema';
import type { UserSchema } from '../users/schemas/user.schema';
import type { Sequelize } from 'sequelize';
import { UserRole } from '../users/schemas/enums/users.enum';
import { UpdateAmountRule } from './rules/update-amount';

export class PlatformWalletsController {
  constructor(
    private readonly platformWalletSchema: typeof PlatformWalletSchema,
    private readonly userSchema: typeof UserSchema,
    private readonly sequelize: Sequelize,
  ) {}
  readonly findBalance: SpongHandler = async (spongReq, spongRes) => {
    const wallet = await this.platformWalletSchema.findOne();

    if (!wallet) {
      return spongRes.SpongNotFound({
        success: false,
        message: 'Platform wallet not found',
      });
    }

    return spongRes.SpongOK({
      success: true,
      data: {
        balance: Number(wallet.balance),
      },
    });
  };

  readonly withdraw: SpongHandler = async (spongReq, spongRes) => {
    const adminId = spongReq.user!.id;

    const { amount } = await spongReq.json<{ amount: number }>();

    const validation = Validator.validate({ amount }, UpdateAmountRule);

    if (!validation.valid) {
      return spongRes.SpongUnprocessableContent({
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      });
    }

    const transaction = await this.sequelize.transaction();
    try {
      const wallet = await this.platformWalletSchema.findOne({
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!wallet) {
        await transaction.rollback();
        return spongRes.SpongNotFound({
          success: false,
          message: 'Platform wallet not found',
        });
      }
      // 2. Make sure the target user is an admin
      const admin = await this.userSchema.findOne({
        where: {
          id: adminId,
          role: UserRole.ADMIN,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!admin) {
        await transaction.rollback();
        return spongRes.SpongNotFound({
          success: false,
          message: 'Admin not found',
        });
      }

      const walletBalance = Number(wallet.balance);

      // 3. Check platform balance
      if (walletBalance < amount) {
        await transaction.rollback();
        return spongRes.SpongBadRequest({
          success: false,
          message:
            'Insufficient platform wallet balance to complete this operation.',
        });
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

      return spongRes.SpongOK({
        success: true,
        message: 'Funds transferred successfully.',
        data: {
          amount,
          platformBalance: Number(wallet.balance),
          adminBalance: Number(admin.balance),
        },
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };
}
