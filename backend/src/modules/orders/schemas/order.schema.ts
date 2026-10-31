import { DataTypes, Model } from "sequelize";
import { UserSchema } from "../../users/schemas/user.schema";
import { OrderStatus } from "./enums/order.enum";
import { sequelize } from "../../../config/db/sequelize";

export class OrderSchema extends Model {
  declare id: string;
  declare clientId: string;
  declare client: UserSchema;
  declare totalAmount: number;
  declare status: OrderStatus;
  declare services: {
    id: string;
    title: string;
    description: string;
    price: number;
    deliveryDays: number;
    images: { url: string; publicId: string }[];
    freelancer: {
      id: string;
      user: {
        id: string;
        firstName: string;
        lastName: string;
        profile: { avatar: { url: string; publicId: string } | null };
      };
    };
  }[];
}

OrderSchema.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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

    totalAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(...Object.values(OrderStatus)),
      allowNull: false,
      defaultValue: OrderStatus.PENDING_PAYMENT,
    },

    services: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "orders",
    timestamps: true,
    indexes: [
      {
        fields: ["clientId"],
      },
      {
        fields: ["status"],
      },
    ],
  },
);

OrderSchema.belongsTo(UserSchema, {
  foreignKey: "clientId",
  as: "client",
});
