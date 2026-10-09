import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserVerificationStatus } from '../../../common/enums/user-verification.enum.js';
import { User } from '../../users/schema/user.schema.js';

@Table({
  tableName: 'user_verifications',
  timestamps: true,
})
export class UserVerification extends Model {
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

  @BelongsTo(() => User)
  declare user: User;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    defaultValue: null,
  })
  declare profileImage: {
    url: string;
    publicId: string;
  } | null;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    defaultValue: null,
  })
  declare identityDocument: {
    url: string;
    publicId: string;
  } | null;

  @Column({
    type: DataType.ENUM(...Object.values(UserVerificationStatus)),
    allowNull: true,
    defaultValue: null,
  })
  declare status: UserVerificationStatus | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    defaultValue: null,
  })
  declare rejectionReason: string | null;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    defaultValue: null,
  })
  declare reviewedBy: string | null;

  @BelongsTo(() => User, 'reviewedBy')
  declare reviewer: User;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: null,
  })
  declare submittedAt: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: null,
  })
  declare reviewedAt: Date | null;
}
