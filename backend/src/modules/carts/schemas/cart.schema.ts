import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../config/db/sequelize";
import { UserSchema } from "../../users/schemas/user.schema";
import { CartItemSchema } from "./cart-item.schema";

export class CartSchema extends Model {
  declare id: string;
  declare userId: string;
  declare items: CartItemSchema[];
}

CartSchema.init(
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
  },
  {
    sequelize,
    tableName: "carts",
    timestamps: true,
  },
);

CartSchema.belongsTo(UserSchema, {
  foreignKey: "userId",
  as: "user",
});

CartSchema.hasMany(CartItemSchema, {
  foreignKey: "cartId",
  as: "items",
});
