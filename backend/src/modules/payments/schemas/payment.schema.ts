import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../config/db/sequelize";
import { OrderSchema } from "../../orders/schemas/order.schema";
import { UserSchema } from "../../users/schemas/user.schema";
import { PaymentStatus } from "./enums/payment.enum";

export class PaymentSchema extends Model {
  declare id: string;
  declare orderId: string;
  declare order: OrderSchema;
  declare userId: string;
  declare user: UserSchema;
  declare amount: number;
  declare status: PaymentStatus;
  declare paidAt: Date | null;
}

PaymentSchema.init(
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

    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(...Object.values(PaymentStatus)),
      allowNull: false,
      defaultValue: PaymentStatus.PENDING,
    },

    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    tableName: "payments",
    timestamps: true,
    indexes: [
      {
        fields: ["orderId"],
      },
      {
        fields: ["userId"],
      },
    ],
  },
);

PaymentSchema.belongsTo(UserSchema, {
  foreignKey: "userId",
  as: "user",
});

PaymentSchema.belongsTo(OrderSchema, {
  foreignKey: "orderId",
  as: "order",
});
