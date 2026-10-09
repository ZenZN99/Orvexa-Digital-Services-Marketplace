import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { SupportConversation } from '../../coversations/schema/support-conversation.schema.js';
import { User } from '../../../users/schema/user.schema.js';

@Table({
  tableName: 'support_messages',
  timestamps: true,
  indexes: [
    {
      fields: ['conversationId'],
    },
    {
      fields: ['senderId'],
    },
  ],
})
export class SupportMessage extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => SupportConversation)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare conversationId: string;

  @BelongsTo(() => SupportConversation)
  declare conversation: SupportConversation;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare senderId: string;

  @BelongsTo(() => User)
  declare sender: User;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare message: string | null;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: [],
  })
  declare attachments: string[];

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare isRead: boolean;
}
