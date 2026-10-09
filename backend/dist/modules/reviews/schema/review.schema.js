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
import { Contract } from '../../contracts/schema/contract.schema.js';
import { Service } from '../../services/schema/service.schema.js';
import { User } from '../../users/schema/user.schema.js';
import { Freelancer } from '../../profiles/freelancer/schema/freelancer.schema.js';
let Review = class Review extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], Review.prototype, "id", void 0);
__decorate([
    ForeignKey(() => Contract),
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Review.prototype, "contractId", void 0);
__decorate([
    BelongsTo(() => Contract),
    __metadata("design:type", Contract)
], Review.prototype, "contract", void 0);
__decorate([
    ForeignKey(() => Service),
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Review.prototype, "serviceId", void 0);
__decorate([
    BelongsTo(() => Service),
    __metadata("design:type", Service)
], Review.prototype, "service", void 0);
__decorate([
    ForeignKey(() => User),
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Review.prototype, "clientId", void 0);
__decorate([
    BelongsTo(() => User, 'clientId'),
    __metadata("design:type", User)
], Review.prototype, "client", void 0);
__decorate([
    ForeignKey(() => Freelancer),
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Review.prototype, "freelancerId", void 0);
__decorate([
    BelongsTo(() => Freelancer),
    __metadata("design:type", Freelancer)
], Review.prototype, "freelancer", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Review.prototype, "rating", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
        allowNull: true,
        defaultValue: null,
    }),
    __metadata("design:type", Object)
], Review.prototype, "comment", void 0);
Review = __decorate([
    Table({
        tableName: 'reviews',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['contractId'],
            },
            {
                fields: ['serviceId'],
            },
            {
                fields: ['clientId'],
            },
            {
                fields: ['freelancerId'],
            },
        ],
    })
], Review);
export { Review };
//# sourceMappingURL=review.schema.js.map