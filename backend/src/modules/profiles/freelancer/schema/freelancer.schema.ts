import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../../users/schema/user.schema.js';
import { JobTitle, Skills } from '../../../../common/enums/freelancer.enum.js';

@Table({
  tableName: 'freelancers',
  timestamps: true,
})
export class Freelancer extends Model {
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

  @Column({
    type: DataType.ENUM(...Object.values(JobTitle)),
    allowNull: true,
    defaultValue: JobTitle.NO_JOB_TITLE,
  })
  declare jobTitle: JobTitle;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    defaultValue: 'No about yet.',
  })
  declare about: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: [],
  })
  declare skills: Skills[];

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  declare website: string | null;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare completedOrders: number;

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

  @BelongsTo(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  declare user: User;
}
