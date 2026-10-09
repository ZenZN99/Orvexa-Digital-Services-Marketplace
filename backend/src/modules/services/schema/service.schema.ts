import {
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  Model,
  Table,
} from 'sequelize-typescript';

import { Freelancer } from '../../profiles/freelancer/schema/freelancer.schema.js';
import {
  ServiceCategory,
  ServiceStatus,
} from '../../../common/enums/service.enum.js';

@Table({
  tableName: 'services',
  timestamps: true,
  indexes: [
    {
      fields: ['freelancerId'],
    },
    {
      fields: ['status'],
    },
  ],
})
export class Service extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => Freelancer)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare freelancerId: string;

  @BelongsTo(() => Freelancer)
  declare freelancer: Freelancer;

  @Column({
    type: DataType.ENUM(...Object.values(ServiceCategory)),
    allowNull: false,
  })
  declare category: ServiceCategory;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare description: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: [],
  })
  declare features: string[];

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: [],
  })
  declare images: {
    url: string;
    publicId: string;
  }[];

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: [],
  })
  declare keywords: string[];

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  declare price: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare deliveryDays: number;

  @Column({
    type: DataType.ENUM(...Object.values(ServiceStatus)),
    allowNull: false,
    defaultValue: ServiceStatus.PENDING,
  })
  declare status: ServiceStatus;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare ordersCount: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare ratingCount: number;

  @Column({
    type: DataType.DECIMAL(3, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare ratingAverage: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    defaultValue: null,
  })
  declare reason: string | null;
}
