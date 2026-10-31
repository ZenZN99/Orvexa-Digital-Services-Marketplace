import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../../config/db/sequelize';
import { UserRole } from './enums/users.enum';
import { UserProfileSchema } from '../../user-profiles/schemas/user-profile.schema';

export type AuthenticationUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  balance: number;
  frozenBalance: number;
  lastLoginAt: Date | null;
  refreshToken: string | null;
  profile: UserProfileSchema;
};

export class UserSchema extends Model {
  declare id: string;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare password: string;
  declare role: UserRole;
  declare isActive: boolean;
  declare balance: number;
  declare frozenBalance: number;
  declare lastLoginAt: Date | null;
  declare refreshToken: string | null;
  declare profile: UserProfileSchema;
}

UserSchema.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
      set(value: string) {
        this.setDataValue('email', value.toLowerCase().trim());
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
      defaultValue: UserRole.FREELANCER,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    balance: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    frozenBalance: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },

    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },

    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    timestamps: true,
    tableName: 'users',
  },
);

UserSchema.hasOne(UserProfileSchema, {
  foreignKey: 'userId',
  as: 'profile',
  onDelete: 'CASCADE',
});
