import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../config/db/sequelize";
import { CartSchema } from "./cart.schema";
import { ServiceSchema } from "../../services/schemas/service.schema";

export class CartItemSchema extends Model {
  declare id: string;
  declare cartId: string;
  declare serviceId: string;
  declare cart: CartSchema;
  declare service: ServiceSchema;
}

CartItemSchema.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    cartId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "carts",
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
  },
  {
    sequelize,
    tableName: "cart_items",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["cartId", "serviceId"],
      },
      {
        fields: ["serviceId"],
      },
    ],
  },
);
