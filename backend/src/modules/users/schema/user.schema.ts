import { Column, DataType, HasOne, Model, Table } from 'sequelize-typescript';

import { UserRole } from '../../../common/enums/user.enum.js';
import { UserProfile } from '../../profiles/user-profiles/schema/user-profile.schema.js';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  declare firstName: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  declare lastName: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
    set(value: string) {
      this.setDataValue('email', value.toLowerCase().trim());
    },
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false,
    defaultValue: UserRole.FREELANCER,
  })
  declare role: UserRole;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    defaultValue: null,
  })
  declare refreshToken: string | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare isActive: boolean;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare balance: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare frozenBalance: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: null,
  })
  declare lastLoginAt: Date | null;

  @HasOne(() => UserProfile, {
    foreignKey: 'userId',
    as: 'profile',
  })
  declare profile: UserProfile;
}
