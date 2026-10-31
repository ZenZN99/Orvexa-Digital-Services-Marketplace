import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../config/db/sequelize";
import { ContractSchema } from "../../contracts/schemas/contract.schema";
import { ServiceSchema } from "../../services/schemas/service.schema";
import { UserSchema } from "../../users/schemas/user.schema";
import { FreelancerSchema } from "../../freelancers/schemas/freelancer.schema";

export class ReviewSchema extends Model {
  declare id: string;
  declare contractId: string;
  declare contract: ContractSchema;
  declare serviceId: string;
  declare service: ServiceSchema;
  declare clientId: string;
  declare client: UserSchema;
  declare freelancerId: string;
  declare freelancer: FreelancerSchema;
  declare rating: number;
  declare comment: string | null;
}

ReviewSchema.init(
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

    serviceId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "services",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    clientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
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

    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    tableName: "reviews",
    timestamps: true,

    indexes: [
      {
        unique: true,
        fields: ["contractId"],
      },
      {
        fields: ["serviceId"],
      },
      {
        fields: ["clientId"],
      },
      {
        fields: ["freelancerId"],
      },
    ],
  },
);

ReviewSchema.belongsTo(ContractSchema, {
  foreignKey: "contractId",
  as: "contract",
});

ReviewSchema.belongsTo(ServiceSchema, {
  foreignKey: "serviceId",
  as: "service",
});

ReviewSchema.belongsTo(UserSchema, {
  foreignKey: "clientId",
  as: "client",
});

ReviewSchema.belongsTo(FreelancerSchema, {
  foreignKey: "freelancerId",
  as: "freelancer",
});
