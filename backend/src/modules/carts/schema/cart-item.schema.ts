import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { Cart } from './cart.schema.js';
import { Service } from '../../services/schema/service.schema.js';

@Table({
  tableName: 'cart_items',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['cartId', 'serviceId'],
    },
    {
      fields: ['serviceId'],
    },
  ],
})
export class CartItem extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => Cart)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare cartId: string;

  @ForeignKey(() => Service)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare serviceId: string;

  @BelongsTo(() => Service)
  declare service: Service;
}
