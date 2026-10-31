import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../config/db/sequelize";

export class PlatformWalletSchema extends Model {
  declare id: string;
  declare balance: number;
  declare key: string;
}

PlatformWalletSchema.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    balance: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },

    key: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "platform_wallets",
    timestamps: true,
  },
);
