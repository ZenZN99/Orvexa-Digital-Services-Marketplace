import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { User } from '../../users/schema/user.schema.js';
import { OrderStatus } from '../../../common/enums/order.enum.js';

@Table({
  tableName: 'orders',
  timestamps: true,
  indexes: [
    {
      fields: ['clientId'],
    },
    {
      fields: ['status'],
    },
  ],
})
export class Order extends Model {
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
  })
  declare clientId: string;

  @BelongsTo(() => User)
  declare client: User;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  declare totalAmount: number;

  @Column({
    type: DataType.ENUM(...Object.values(OrderStatus)),
    allowNull: false,
    defaultValue: OrderStatus.PENDING_PAYMENT,
  })
  declare status: OrderStatus;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
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
