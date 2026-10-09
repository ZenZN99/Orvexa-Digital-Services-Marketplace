import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../../users/schema/user.schema.js';

@Table({
  tableName: 'user_profiles',
  timestamps: true,
  indexes: [{ fields: ['userId'] }],
})
export class UserProfile extends Model {
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
  declare userId: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    defaultValue: null,
  })
  declare avatar: {
    url: string;
    publicId: string;
  } | null;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    defaultValue: null,
  })
  declare cover: {
    url: string;
    publicId: string;
  } | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: 'No bio yet.',
  })
  declare bio: string;
}
