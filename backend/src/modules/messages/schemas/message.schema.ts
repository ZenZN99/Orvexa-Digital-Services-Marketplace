import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../config/db/sequelize";
import { ContractSchema } from "../../contracts/schemas/contract.schema";
import { UserSchema } from "../../users/schemas/user.schema";

export class MessageSchema extends Model {
  declare id: string;
  declare contractId: string;
  declare contract: ContractSchema;
  declare senderId: string;
  declare sender: UserSchema;
  declare content: string | null;
  declare images: {
    url: string;
    publicId: string;
  }[];
}

MessageSchema.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    contractId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "contracts",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },

    images: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    sequelize,
    tableName: "messages",
    timestamps: true,
    indexes: [
      {
        fields: ["contractId"],
      },
      {
        fields: ["senderId"],
      },
    ],
  },
);

MessageSchema.belongsTo(ContractSchema, {
  foreignKey: "contractId",
  as: "contract",
  onDelete: "CASCADE",
});

MessageSchema.belongsTo(UserSchema, {
  foreignKey: "senderId",
  as: "sender",
  onDelete: "CASCADE",
});
