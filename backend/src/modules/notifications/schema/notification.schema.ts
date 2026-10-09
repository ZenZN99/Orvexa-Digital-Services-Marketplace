import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../users/schema/user.schema.js';
import { NotificationType } from '../../../common/enums/notification.enum.js';

@Table({
  tableName: 'notifications',
  timestamps: true,
  indexes: [{ fields: ['receiverId'] }],
})
export class Notification extends Model {
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
  declare senderId: string;

  @BelongsTo(() => User, 'senderId')
  declare sender: User;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare receiverId: string;

  @BelongsTo(() => User, 'receiverId')
  declare receiver: User;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    defaultValue: null,
  })
  declare targetId: string | null;

  @Column({
    type: DataType.ENUM(...Object.values(NotificationType)),
    allowNull: false,
  })
  declare type: NotificationType;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare message: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare isRead: boolean;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
    defaultValue: null,
  })
  declare link: string | null;
}
