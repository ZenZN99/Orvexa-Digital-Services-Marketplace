import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../config/db/sequelize";

export class UserProfileSchema extends Model {
  declare id: string;
  declare userId: string;
  declare avatar: {
    url: string;
    publicId: string;
  } | null;

  declare cover: {
    url: string;
    publicId: string;
  } | null;

  declare bio: string | null;
}

UserProfileSchema.init(
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

    avatar: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: null,
    },

    cover: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: null,
    },

    bio: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "No bio yet.",
    },
  },
  {
    sequelize,
    timestamps: true,
    tableName: "user_profiles",
  },
);
