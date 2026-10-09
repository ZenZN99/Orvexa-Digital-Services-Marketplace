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
import { SupportConversation } from '../../coversations/schema/support-conversation.schema.js';
import { User } from '../../../users/schema/user.schema.js';
let SupportMessage = class SupportMessage extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], SupportMessage.prototype, "id", void 0);
__decorate([
    ForeignKey(() => SupportConversation),
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], SupportMessage.prototype, "conversationId", void 0);
__decorate([
    BelongsTo(() => SupportConversation),
    __metadata("design:type", SupportConversation)
], SupportMessage.prototype, "conversation", void 0);
__decorate([
    ForeignKey(() => User),
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], SupportMessage.prototype, "senderId", void 0);
__decorate([
    BelongsTo(() => User),
    __metadata("design:type", User)
], SupportMessage.prototype, "sender", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], SupportMessage.prototype, "message", void 0);
__decorate([
    Column({
        type: DataType.JSONB,
        allowNull: false,
        defaultValue: [],
    }),
    __metadata("design:type", Array)
], SupportMessage.prototype, "attachments", void 0);
__decorate([
    Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], SupportMessage.prototype, "isRead", void 0);
SupportMessage = __decorate([
    Table({
        tableName: 'support_messages',
        timestamps: true,
        indexes: [
            {
                fields: ['conversationId'],
            },
            {
                fields: ['senderId'],
            },
        ],
    })
], SupportMessage);
export { SupportMessage };
//# sourceMappingURL=support-message.schema.js.map