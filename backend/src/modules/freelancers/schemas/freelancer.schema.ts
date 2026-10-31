import { DataTypes, Model } from "sequelize";
import { JobTitle, Skills } from "./enums/freelancers.enum";
import { UserSchema } from "../../users/schemas/user.schema";
import { sequelize } from "../../../config/db/sequelize";

export class FreelancerSchema extends Model {
  declare id: string;
  declare userId: string;
  declare jobTitle: JobTitle;
  declare about: string;
  declare skills: Skills[];
  declare website: string | null;
  declare completedOrders: number;
  declare ratingCount: number;
  declare ratingAverage: number;
  declare user: UserSchema;
}

FreelancerSchema.init(
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

    jobTitle: {
      type: DataTypes.ENUM(...Object.values(JobTitle)),
      allowNull: true,
      defaultValue: JobTitle.NO_JOB_TITLE,
    },

    about: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "No bio yet.",
    },

    skills: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },

    website: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },

    completedOrders: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    ratingCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    ratingAverage: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "freelancers",
    timestamps: true,
  },
);

FreelancerSchema.belongsTo(UserSchema, {
  foreignKey: "userId",
  as: "user",
});
