import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../../users/schema/user.schema.js';
import { SupportConversationStatus } from '../../../../common/enums/support-conversation.enum.js';

@Table({
  tableName: 'support_conversations',
  timestamps: true,
  indexes: [
    {
      fields: ['userId'],
    },
    {
      fields: ['status'],
    },
  ],
})
export class SupportConversation extends Model {
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

  @BelongsTo(() => User, 'userId')
  declare user: User;

  @Column({
    type: DataType.ENUM(...Object.values(SupportConversationStatus)),
    allowNull: false,
    defaultValue: SupportConversationStatus.OPEN,
  })
  declare status: SupportConversationStatus;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    defaultValue: '',
  })
  declare lastMessage: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    defaultValue: null,
  })
  declare lastMessageSenderId: string | null;

  @BelongsTo(() => User, 'lastMessageSenderId')
  declare lastMessageSender: User;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: null,
  })
  declare closedAt: Date | null;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    defaultValue: null,
  })
  declare closedBy: string | null;

  @BelongsTo(() => User, 'closedBy')
  declare closedByUser: User;
}
