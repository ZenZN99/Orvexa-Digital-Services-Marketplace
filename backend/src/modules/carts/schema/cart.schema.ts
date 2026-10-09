import {
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';

import { User } from '../../users/schema/user.schema.js';
import { CartItem } from './cart-item.schema.js';

@Table({
  tableName: 'carts',
  timestamps: true,
})
export class Cart extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
  })
  declare userId: string;

  @HasMany(() => CartItem, {
    foreignKey: 'cartId',
    as: 'items',
  })
  declare items: CartItem[];
}
