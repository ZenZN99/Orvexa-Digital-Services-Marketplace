import { DataTypes, Model } from "sequelize";
import { UserSchema } from "../../users/schemas/user.schema";
import { UserVerificationStatus } from "./enums/user-verification.enum";
import { sequelize } from "../../../config/db/sequelize";

export class UserVerificationSchema extends Model {
  declare id: string;
  declare userId: string;
  declare profileImage: {
    url: string;
    publicId: string;
  } | null;
  declare identityDocument: {
    url: string;
    publicId: string;
  } | null;
  declare status: UserVerificationStatus | null;
  declare rejectionReason: string | null;
  declare reviewedBy: string | null;
  declare submittedAt: Date | null;
  declare reviewedAt: Date | null;
  declare reviewer: UserSchema;
  declare user: UserSchema;
}

UserVerificationSchema.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    profileImage: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: null,
    },

    identityDocument: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: null,
    },

    status: {
      type: DataTypes.ENUM(...Object.values(UserVerificationStatus)),
      allowNull: true,
      defaultValue: null,
    },

    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },

    reviewedBy: {
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

    submittedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },

    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    tableName: "user_verifications",
    timestamps: true,
  },
);

UserVerificationSchema.belongsTo(UserSchema, {
  foreignKey: "userId",
  as: "user",
});

UserVerificationSchema.belongsTo(UserSchema, {
  foreignKey: "reviewedBy",
  as: "reviewer",
});
