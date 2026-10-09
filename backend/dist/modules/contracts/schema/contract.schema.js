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
import { Order } from '../../orders/schema/order.schema.js';
import { Service } from '../../services/schema/service.schema.js';
import { User } from '../../users/schema/user.schema.js';
import { ContractStatus } from '../../../common/enums/contract.enum.js';
import { Freelancer } from '../../profiles/freelancer/schema/freelancer.schema.js';
let Contract = class Contract extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], Contract.prototype, "id", void 0);
__decorate([
    ForeignKey(() => Order),
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Contract.prototype, "orderId", void 0);
__decorate([
    BelongsTo(() => Order),
    __metadata("design:type", Order)
], Contract.prototype, "order", void 0);
__decorate([
    ForeignKey(() => Service),
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Contract.prototype, "serviceId", void 0);
__decorate([
    BelongsTo(() => Service),
    __metadata("design:type", Service)
], Contract.prototype, "service", void 0);
__decorate([
    ForeignKey(() => Freelancer),
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Contract.prototype, "freelancerId", void 0);
__decorate([
    BelongsTo(() => Freelancer, 'freelancerId'),
    __metadata("design:type", Freelancer)
], Contract.prototype, "freelancer", void 0);
__decorate([
    ForeignKey(() => User),
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Contract.prototype, "clientId", void 0);
__decorate([
    BelongsTo(() => User, 'clientId'),
    __metadata("design:type", User)
], Contract.prototype, "client", void 0);
__decorate([
    Column({
        type: DataType.DECIMAL(12, 2),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Contract.prototype, "amount", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Contract.prototype, "deliveryDays", void 0);
__decorate([
    Column({
        type: DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], Contract.prototype, "deadline", void 0);
__decorate([
    Column({
        type: DataType.ENUM(...Object.values(ContractStatus)),
        allowNull: false,
        defaultValue: ContractStatus.IN_PROGRESS,
    }),
    __metadata("design:type", String)
], Contract.prototype, "status", void 0);
__decorate([
    Column({
        type: DataType.DATE,
        allowNull: true,
        defaultValue: null,
    }),
    __metadata("design:type", Object)
], Contract.prototype, "deliveredAt", void 0);
__decorate([
    Column({
        type: DataType.DATE,
        allowNull: true,
        defaultValue: null,
    }),
    __metadata("design:type", Object)
], Contract.prototype, "completedAt", void 0);
__decorate([
    Column({
        type: DataType.DATE,
        allowNull: true,
        defaultValue: null,
    }),
    __metadata("design:type", Object)
], Contract.prototype, "cancelledAt", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
        allowNull: true,
        defaultValue: null,
    }),
    __metadata("design:type", Object)
], Contract.prototype, "cancellationReason", void 0);
Contract = __decorate([
    Table({
        tableName: 'contracts',
        timestamps: true,
        indexes: [
            {
                fields: ['orderId'],
            },
            {
                fields: ['serviceId'],
            },
            {
                fields: ['freelancerId'],
            },
            {
                fields: ['clientId'],
            },
            {
                fields: ['status'],
            },
            {
                fields: ['deadline'],
            },
        ],
    })
], Contract);
export { Contract };
//# sourceMappingURL=contract.schema.js.map