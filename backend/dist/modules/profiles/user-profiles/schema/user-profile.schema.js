var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, DataType, ForeignKey, Model, Table, } from 'sequelize-typescript';
import { User } from '../../../users/schema/user.schema.js';
let UserProfile = class UserProfile extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], UserProfile.prototype, "id", void 0);
__decorate([
    ForeignKey(() => User),
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], UserProfile.prototype, "userId", void 0);
__decorate([
    Column({
        type: DataType.JSONB,
        allowNull: true,
        defaultValue: null,
    }),
    __metadata("design:type", Object)
], UserProfile.prototype, "avatar", void 0);
__decorate([
    Column({
        type: DataType.JSONB,
        allowNull: true,
        defaultValue: null,
    }),
    __metadata("design:type", Object)
], UserProfile.prototype, "cover", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: true,
        defaultValue: 'No bio yet.',
    }),
    __metadata("design:type", String)
], UserProfile.prototype, "bio", void 0);
UserProfile = __decorate([
    Table({
        tableName: 'user_profiles',
        timestamps: true,
        indexes: [{ fields: ['userId'] }],
    })
], UserProfile);
export { UserProfile };
//# sourceMappingURL=user-profile.schema.js.map