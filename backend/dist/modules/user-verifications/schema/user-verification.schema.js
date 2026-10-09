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
import { UserVerificationStatus } from '../../../common/enums/user-verification.enum.js';
import { User } from '../../users/schema/user.schema.js';
let UserVerification = class UserVerification extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], UserVerification.prototype, "id", void 0);
__decorate([
    ForeignKey(() => User),
    Column({
        type: DataType.UUID,
        allowNull: false,
        unique: true,
    }),
    __metadata("design:type", String)
], UserVerification.prototype, "userId", void 0);
__decorate([
    BelongsTo(() => User),
    __metadata("design:type", User)
], UserVerification.prototype, "user", void 0);
__decorate([
    Column({
        type: DataType.JSONB,
        allowNull: true,
        defaultValue: null,
    }),
    __metadata("design:type", Object)
], UserVerification.prototype, "profileImage", void 0);
__decorate([
    Column({
        type: DataType.JSONB,
        allowNull: true,
        defaultValue: null,
    }),
    __metadata("design:type", Object)
], UserVerification.prototype, "identityDocument", void 0);
__decorate([
    Column({
        type: DataType.ENUM(...Object.values(UserVerificationStatus)),
        allowNull: true,
        defaultValue: null,
    }),
    __metadata("design:type", Object)
], UserVerification.prototype, "status", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
        allowNull: true,
        defaultValue: null,
    }),
    __metadata("design:type", Object)
], UserVerification.prototype, "rejectionReason", void 0);
__decorate([
    ForeignKey(() => User),
    Column({
        type: DataType.UUID,
        allowNull: true,
        defaultValue: null,
    }),
    __metadata("design:type", Object)
], UserVerification.prototype, "reviewedBy", void 0);
__decorate([
    BelongsTo(() => User, 'reviewedBy'),
    __metadata("design:type", User)
], UserVerification.prototype, "reviewer", void 0);
__decorate([
    Column({
        type: DataType.DATE,
        allowNull: true,
        defaultValue: null,
    }),
    __metadata("design:type", Object)
], UserVerification.prototype, "submittedAt", void 0);
__decorate([
    Column({
        type: DataType.DATE,
        allowNull: true,
        defaultValue: null,
    }),
    __metadata("design:type", Object)
], UserVerification.prototype, "reviewedAt", void 0);
UserVerification = __decorate([
    Table({
        tableName: 'user_verifications',
        timestamps: true,
    })
], UserVerification);
export { UserVerification };
//# sourceMappingURL=user-verification.schema.js.map