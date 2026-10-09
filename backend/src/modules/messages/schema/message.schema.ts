import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Contract } from '../../contracts/schema/contract.schema.js';
import { User } from '../../users/schema/user.schema.js';

@Table({
  tableName: 'messages',
  timestamps: true,
  indexes: [
    {
      fields: ['contractId'],
    },
    {
      fields: ['senderId'],
    },
  ],
})
export class Message extends Model {
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
    defaultValue: null,
  })
  declare content: string | null;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: [],
  })
  declare images: {
    url: string;
    publicId: string;
  }[];
}
