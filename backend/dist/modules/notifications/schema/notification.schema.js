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
import { NotificationType } from '../../../common/enums/notification.enum.js';
let Notification = class Notification extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], Notification.prototype, "id", void 0);
__decorate([
    ForeignKey(() => User),
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Notification.prototype, "senderId", void 0);
__decorate([
    BelongsTo(() => User, 'senderId'),
    __metadata("design:type", User)
], Notification.prototype, "sender", void 0);
__decorate([
    ForeignKey(() => User),
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Notification.prototype, "receiverId", void 0);
__decorate([
    BelongsTo(() => User, 'receiverId'),
    __metadata("design:type", User)
], Notification.prototype, "receiver", void 0);
__decorate([
    Column({
        type: DataType.UUID,
        allowNull: true,
        defaultValue: null,
    }),
    __metadata("design:type", Object)
], Notification.prototype, "targetId", void 0);
__decorate([
    Column({
        type: DataType.ENUM(...Object.values(NotificationType)),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Notification.prototype, "type", void 0);
__decorate([
    Column({
        type: DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Notification.prototype, "message", void 0);
__decorate([
    Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Notification.prototype, "isRead", void 0);
__decorate([
    Column({
        type: DataType.STRING(500),
        allowNull: true,
        defaultValue: null,
    }),
    __metadata("design:type", Object)
], Notification.prototype, "link", void 0);
Notification = __decorate([
    Table({
        tableName: 'notifications',
        timestamps: true,
        indexes: [{ fields: ['receiverId'] }],
    })
], Notification);
export { Notification };
//# sourceMappingURL=notification.schema.js.map