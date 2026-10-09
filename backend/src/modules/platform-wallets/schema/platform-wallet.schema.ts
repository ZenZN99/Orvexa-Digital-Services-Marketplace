import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'platform_wallets',
  timestamps: true,
})
export class PlatformWallet extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare balance: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  declare key: string;
}
