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
import { SupportConversationStatus } from '../../../../common/enums/support-conversation.enum.js';
let SupportConversation = class SupportConversation extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], SupportConversation.prototype, "id", void 0);
__decorate([
    ForeignKey(() => User),
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], SupportConversation.prototype, "userId", void 0);
__decorate([
    BelongsTo(() => User, 'userId'),
    __metadata("design:type", User)
], SupportConversation.prototype, "user", void 0);
__decorate([
    Column({
        type: DataType.ENUM(...Object.values(SupportConversationStatus)),
        allowNull: false,
        defaultValue: SupportConversationStatus.OPEN,
    }),
    __metadata("design:type", String)
], SupportConversation.prototype, "status", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
        allowNull: false,
        defaultValue: '',
    }),
    __metadata("design:type", String)
], SupportConversation.prototype, "lastMessage", void 0);
__decorate([
    ForeignKey(() => User),
    Column({
        type: DataType.UUID,
        allowNull: true,
        defaultValue: null,
    }),
    __metadata("design:type", Object)
], SupportConversation.prototype, "lastMessageSenderId", void 0);
__decorate([
    BelongsTo(() => User, 'lastMessageSenderId'),
    __metadata("design:type", User)
], SupportConversation.prototype, "lastMessageSender", void 0);
__decorate([
    Column({
        type: DataType.DATE,
        allowNull: true,
        defaultValue: null,
    }),
    __metadata("design:type", Object)
], SupportConversation.prototype, "closedAt", void 0);
__decorate([
    ForeignKey(() => User),
    Column({
        type: DataType.UUID,
        allowNull: true,
        defaultValue: null,
    }),
    __metadata("design:type", Object)
], SupportConversation.prototype, "closedBy", void 0);
__decorate([
    BelongsTo(() => User, 'closedBy'),
    __metadata("design:type", User)
], SupportConversation.prototype, "closedByUser", void 0);
SupportConversation = __decorate([
    Table({
        tableName: 'support_conversations',
        timestamps: true,
        indexes: [
            {
                fields: ['userId'],
            },
            {
                fields: ['status'],
            },
        ],
    })
], SupportConversation);
export { SupportConversation };
//# sourceMappingURL=support-conversation.schema.js.map