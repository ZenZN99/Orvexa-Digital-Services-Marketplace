import { DataTypes, Model } from "sequelize";
import { FreelancerSchema } from "../../freelancers/schemas/freelancer.schema";
import { ServiceCategory, ServiceStatus } from "./enums/service.enum";
import { sequelize } from "../../../config/db/sequelize";

export class ServiceSchema extends Model {
  declare id: string;
  declare freelancerId: string;
  declare freelancer: FreelancerSchema;
  declare category: ServiceCategory;
  declare title: string;
  declare description: string;
  declare features: string[];
  declare images: {
    url: string;
    publicId: string;
  }[];
  declare keywords: string[];
  declare price: number;
  declare deliveryDays: number;
  declare status: ServiceStatus;
  declare ordersCount: number;
  declare ratingCount: number;
  declare ratingAverage: number;
  declare reason: string | null;
}

ServiceSchema.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    freelancerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "freelancers",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    category: {
      type: DataTypes.ENUM(...Object.values(ServiceCategory)),
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    features: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },

    images: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },

    keywords: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },

    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },

    deliveryDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(...Object.values(ServiceStatus)),
      allowNull: false,
      defaultValue: ServiceStatus.PENDING,
    },

    ordersCount: {
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

    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    tableName: "services",
    timestamps: true,
    indexes: [
      {
        fields: ["freelancerId"],
      },
      {
        fields: ["status"],
      },
    ],
  },
);

ServiceSchema.belongsTo(FreelancerSchema, {
  foreignKey: "freelancerId",
  as: "freelancer",
});
