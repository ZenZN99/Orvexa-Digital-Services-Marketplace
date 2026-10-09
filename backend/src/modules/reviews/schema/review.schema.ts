import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Contract } from '../../contracts/schema/contract.schema.js';
import { Service } from '../../services/schema/service.schema.js';
import { User } from '../../users/schema/user.schema.js';
import { Freelancer } from '../../profiles/freelancer/schema/freelancer.schema.js';

@Table({
  tableName: 'reviews',
  timestamps: true,

  indexes: [
    {
      unique: true,
      fields: ['contractId'],
    },
    {
      fields: ['serviceId'],
    },
    {
      fields: ['clientId'],
    },
    {
      fields: ['freelancerId'],
    },
  ],
})
export class Review extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => Contract)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare contractId: string;

  @BelongsTo(() => Contract)
  declare contract: Contract;

  @ForeignKey(() => Service)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare serviceId: string;

  @BelongsTo(() => Service)
  declare service: Service;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare clientId: string;

  @BelongsTo(() => User, 'clientId')
  declare client: User;

  @ForeignKey(() => Freelancer)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare freelancerId: string;

  @BelongsTo(() => Freelancer)
  declare freelancer: Freelancer;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare rating: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    defaultValue: null,
  })
  declare comment: string | null;
}
