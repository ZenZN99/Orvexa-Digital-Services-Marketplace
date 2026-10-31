import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../config/db/sequelize";
import { UserSchema } from "../../users/schemas/user.schema";
import { SupportConversationStatus } from "./enums/support-coversation.enum";

export class SupportConversationSchema extends Model {
  declare id: string;
  declare userId: string;
  declare user: UserSchema;
  declare status: SupportConversationStatus;
  declare lastMessage: string;
  declare lastMessageSenderId: string | null;
  declare lastMessageSender: UserSchema;
  declare closedAt: Date | null;
  declare closedBy: string | null;
  declare closedByUser: UserSchema;
}

SupportConversationSchema.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    status: {
      type: DataTypes.ENUM(...Object.values(SupportConversationStatus)),
      allowNull: false,
      defaultValue: SupportConversationStatus.OPEN,
    },

    lastMessage: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },

    lastMessageSenderId: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: null,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    closedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },

    closedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: null,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    sequelize,
    tableName: "support_conversations",
    timestamps: true,
    indexes: [
      {
        fields: ["userId"],
      },
      {
        fields: ["status"],
      },
    ],
  },
);

SupportConversationSchema.belongsTo(UserSchema, {
  foreignKey: "userId",
  as: "user",
  onDelete: "CASCADE",
});

SupportConversationSchema.belongsTo(UserSchema, {
  foreignKey: "lastMessageSenderId",
  as: "lastMessageSender",
  onDelete: "CASCADE",
});

SupportConversationSchema.belongsTo(UserSchema, {
  foreignKey: "closedBy",
  as: "closedByUser",
  onDelete: "CASCADE",
});
