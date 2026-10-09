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
import { User } from '../../../users/schema/user.schema.js';
import { JobTitle } from '../../../../common/enums/freelancer.enum.js';
let Freelancer = class Freelancer extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], Freelancer.prototype, "id", void 0);
__decorate([
    ForeignKey(() => User),
    Column({
        type: DataType.UUID,
        allowNull: false,
        unique: true,
    }),
    __metadata("design:type", String)
], Freelancer.prototype, "userId", void 0);
__decorate([
    Column({
        type: DataType.ENUM(...Object.values(JobTitle)),
        allowNull: true,
        defaultValue: JobTitle.NO_JOB_TITLE,
    }),
    __metadata("design:type", String)
], Freelancer.prototype, "jobTitle", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
        allowNull: true,
        defaultValue: 'No about yet.',
    }),
    __metadata("design:type", String)
], Freelancer.prototype, "about", void 0);
__decorate([
    Column({
        type: DataType.JSONB,
        allowNull: false,
        defaultValue: [],
    }),
    __metadata("design:type", Array)
], Freelancer.prototype, "skills", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: true,
        defaultValue: null,
    }),
    __metadata("design:type", Object)
], Freelancer.prototype, "website", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], Freelancer.prototype, "completedOrders", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], Freelancer.prototype, "ratingCount", void 0);
__decorate([
    Column({
        type: DataType.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], Freelancer.prototype, "ratingAverage", void 0);
__decorate([
    BelongsTo(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
    __metadata("design:type", User)
], Freelancer.prototype, "user", void 0);
Freelancer = __decorate([
    Table({
        tableName: 'freelancers',
        timestamps: true,
    })
], Freelancer);
export { Freelancer };
//# sourceMappingURL=freelancer.schema.js.map