var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, DataType, ForeignKey, BelongsTo, Model, Table, } from 'sequelize-typescript';
import { Freelancer } from '../../profiles/freelancer/schema/freelancer.schema.js';
import { ServiceCategory, ServiceStatus, } from '../../../common/enums/service.enum.js';
let Service = class Service extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], Service.prototype, "id", void 0);
__decorate([
    ForeignKey(() => Freelancer),
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Service.prototype, "freelancerId", void 0);
__decorate([
    BelongsTo(() => Freelancer),
    __metadata("design:type", Freelancer)
], Service.prototype, "freelancer", void 0);
__decorate([
    Column({
        type: DataType.ENUM(...Object.values(ServiceCategory)),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Service.prototype, "category", void 0);
__decorate([
    Column({
        type: DataType.STRING(150),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Service.prototype, "title", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Service.prototype, "description", void 0);
__decorate([
    Column({
        type: DataType.JSONB,
        allowNull: false,
        defaultValue: [],
    }),
    __metadata("design:type", Array)
], Service.prototype, "features", void 0);
__decorate([
    Column({
        type: DataType.JSONB,
        allowNull: false,
        defaultValue: [],
    }),
    __metadata("design:type", Array)
], Service.prototype, "images", void 0);
__decorate([
    Column({
        type: DataType.JSONB,
        allowNull: false,
        defaultValue: [],
    }),
    __metadata("design:type", Array)
], Service.prototype, "keywords", void 0);
__decorate([
    Column({
        type: DataType.DECIMAL(12, 2),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Service.prototype, "price", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Service.prototype, "deliveryDays", void 0);
__decorate([
    Column({
        type: DataType.ENUM(...Object.values(ServiceStatus)),
        allowNull: false,
        defaultValue: ServiceStatus.PENDING,
    }),
    __metadata("design:type", String)
], Service.prototype, "status", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], Service.prototype, "ordersCount", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], Service.prototype, "ratingCount", void 0);
__decorate([
    Column({
        type: DataType.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], Service.prototype, "ratingAverage", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
        allowNull: true,
        defaultValue: null,
    }),
    __metadata("design:type", Object)
], Service.prototype, "reason", void 0);
Service = __decorate([
    Table({
        tableName: 'services',
        timestamps: true,
        indexes: [
            {
                fields: ['freelancerId'],
            },
            {
                fields: ['status'],
            },
        ],
    })
], Service);
export { Service };
//# sourceMappingURL=service.schema.js.map