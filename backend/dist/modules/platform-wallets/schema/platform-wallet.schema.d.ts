import { Model } from 'sequelize-typescript';
export declare class PlatformWallet extends Model {
    id: string;
    balance: number;
    key: string;
}
