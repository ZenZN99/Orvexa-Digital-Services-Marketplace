import { Sequelize } from 'sequelize-typescript';
import { PlatformWallet } from './schema/platform-wallet.schema.js';
import { User } from '../users/schema/user.schema.js';
export declare class PlatformWalletService {
    private readonly platformWalletModel;
    private readonly userModel;
    private readonly sequelize;
    constructor(platformWalletModel: typeof PlatformWallet, userModel: typeof User, sequelize: Sequelize);
    findBalance(): Promise<{
        message: string | null;
        data: any;
    }>;
    withdraw(adminId: string, amount: number): Promise<{
        message: string | null;
        data: any;
    }>;
}
