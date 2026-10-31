import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../config/db/sequelize";
import { OrderSchema } from "../../orders/schemas/order.schema";
import { ServiceSchema } from "../../services/schemas/service.schema";
import { FreelancerSchema } from "../../freelancers/schemas/freelancer.schema";
import { UserSchema } from "../../users/schemas/user.schema";
import { ContractStatus } from "./enums/contract.enum";

export class ContractSchema extends Model {
  declare id: string;
  declare orderId: string;
  declare order: OrderSchema;
  declare serviceId: string;
  declare service: ServiceSchema;
  declare freelancerId: string;
  declare freelancer: FreelancerSchema;
  declare clientId: string;
  declare client: UserSchema;
  declare amount: number;
  declare deliveryDays: number;
  declare deadline: Date;
  declare status: ContractStatus;
  declare deliveredAt: Date | null;
  declare completedAt: Date | null;
  declare cancelledAt: Date | null;
  declare cancellationReason: string | null;
}

ContractSchema.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "orders",
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

    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },

    deliveryDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(...Object.values(ContractStatus)),
      allowNull: false,
      defaultValue: ContractStatus.IN_PROGRESS,
    },

    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },

    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },

    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },

    cancellationReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    tableName: "contracts",
    timestamps: true,
    indexes: [
      {
        fields: ["orderId"],
      },
      {
        fields: ["serviceId"],
      },
      {
        fields: ["freelancerId"],
      },
      {
        fields: ["clientId"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["deadline"],
      },
    ],
  },
);

ContractSchema.belongsTo(OrderSchema, {
  foreignKey: "orderId",
  as: "order",
});

ContractSchema.belongsTo(ServiceSchema, {
  foreignKey: "serviceId",
  as: "service",
});

ContractSchema.belongsTo(FreelancerSchema, {
  foreignKey: "freelancerId",
  as: "freelancer",
});

ContractSchema.belongsTo(UserSchema, {
  foreignKey: "clientId",
  as: "client",
});
