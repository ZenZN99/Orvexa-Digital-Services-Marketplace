import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../config/db/sequelize";
import { UserSchema } from "../../users/schemas/user.schema";
import { NotificationType } from "./enums/notification.enum";

export class NotificationSchema extends Model {
  declare id: string;
  declare senderId: string;
  declare sender: UserSchema;
  declare receiverId: string;
  declare receiver: UserSchema;
  declare targetId: string | null;
  declare type: NotificationType;
  declare message: string;
  declare isRead: boolean;
  declare link: string | null;
}

NotificationSchema.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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

    receiverId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    targetId: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: null,
    },

    type: {
      type: DataTypes.ENUM(...Object.values(NotificationType)),
      allowNull: false,
    },

    message: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    link: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    tableName: "notifications",
    timestamps: true,
    indexes: [{ fields: ["receiverId"] }],
  },
);

NotificationSchema.belongsTo(UserSchema, {
  foreignKey: "senderId",
  as: "sender",
  onDelete: "CASCADE",
});

NotificationSchema.belongsTo(UserSchema, {
  foreignKey: "receiverId",
  as: "receiver",
  onDelete: "CASCADE",
});
