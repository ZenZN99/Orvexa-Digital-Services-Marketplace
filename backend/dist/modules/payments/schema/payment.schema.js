var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BelongsTo, Column, DataType, ForeignKey, Model, Table, } from 'sequelize-typescript';
import { User } from '../../users/schema/user.schema.js';
import { Order } from '../../orders/schema/order.schema.js';
import { PaymentStatus } from '../../../common/enums/payment.enum.js';
let Payment = class Payment extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], Payment.prototype, "id", void 0);
__decorate([
    ForeignKey(() => Order),
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Payment.prototype, "orderId", void 0);
__decorate([
    BelongsTo(() => Order),
    __metadata("design:type", Order)
], Payment.prototype, "order", void 0);
__decorate([
    ForeignKey(() => User),
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Payment.prototype, "userId", void 0);
__decorate([
    BelongsTo(() => User),
    __metadata("design:type", User)
], Payment.prototype, "user", void 0);
__decorate([
    Column({
        type: DataType.DECIMAL(12, 2),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Payment.prototype, "amount", void 0);
__decorate([
    Column({
        type: DataType.ENUM(...Object.values(PaymentStatus)),
        allowNull: false,
        defaultValue: PaymentStatus.PENDING,
    }),
    __metadata("design:type", String)
], Payment.prototype, "status", void 0);
__decorate([
    Column({
        type: DataType.DATE,
        allowNull: true,
        defaultValue: null,
    }),
    __metadata("design:type", Object)
], Payment.prototype, "paidAt", void 0);
Payment = __decorate([
    Table({
        tableName: 'payments',
        timestamps: true,
        indexes: [
            {
                fields: ['orderId'],
            },
            {
                fields: ['userId'],
            },
        ],
    })
], Payment);
export { Payment };
//# sourceMappingURL=payment.schema.js.map