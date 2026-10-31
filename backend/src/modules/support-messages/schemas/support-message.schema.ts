import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../config/db/sequelize";
import { SupportConversationSchema } from "../../support-conversations/schemas/support-conversation.schema";
import { UserSchema } from "../../users/schemas/user.schema";

export class SupportMessageSchema extends Model {
  declare id: string;
  declare conversationId: string;
  declare conversation: SupportConversationSchema;
  declare senderId: string;
  declare sender: UserSchema;
  declare message: string | null;
  declare attachments: string[];
  declare isRead: boolean;
}

SupportMessageSchema.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    conversationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "support_conversations",
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

    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    attachments: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },

    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "support_messages",
    timestamps: true,
    indexes: [
      {
        fields: ["conversationId"],
      },
      {
        fields: ["senderId"],
      },
    ],
  },
);

SupportMessageSchema.belongsTo(SupportConversationSchema, {
  foreignKey: "conversationId",
  as: "conversation",
  onDelete: "CASCADE",
});

SupportMessageSchema.belongsTo(UserSchema, {
  foreignKey: "senderId",
  as: "sender",
  onDelete: "CASCADE",
});
