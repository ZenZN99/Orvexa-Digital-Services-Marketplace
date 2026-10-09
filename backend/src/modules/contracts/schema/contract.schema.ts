import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { Order } from '../../orders/schema/order.schema.js';
import { Service } from '../../services/schema/service.schema.js';
import { User } from '../../users/schema/user.schema.js';

import { ContractStatus } from '../../../common/enums/contract.enum.js';
import { Freelancer } from '../../profiles/freelancer/schema/freelancer.schema.js';
@Table({
  tableName: 'contracts',
  timestamps: true,
  indexes: [
    {
      fields: ['orderId'],
    },
    {
      fields: ['serviceId'],
    },
    {
      fields: ['freelancerId'],
    },
    {
      fields: ['clientId'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['deadline'],
    },
  ],
})
export class Contract extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare orderId: string;

  @BelongsTo(() => Order)
  declare order: Order;

  @ForeignKey(() => Service)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare serviceId: string;

  @BelongsTo(() => Service)
  declare service: Service;

  @ForeignKey(() => Freelancer)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare freelancerId: string;

  @BelongsTo(() => Freelancer, 'freelancerId')
  declare freelancer: Freelancer;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare clientId: string;

  @BelongsTo(() => User, 'clientId')
  declare client: User;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  declare amount: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare deliveryDays: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare deadline: Date;

  @Column({
    type: DataType.ENUM(...Object.values(ContractStatus)),
    allowNull: false,
    defaultValue: ContractStatus.IN_PROGRESS,
  })
  declare status: ContractStatus;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: null,
  })
  declare deliveredAt: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: null,
  })
  declare completedAt: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: null,
  })
  declare cancelledAt: Date | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    defaultValue: null,
  })
  declare cancellationReason: string | null;
}
