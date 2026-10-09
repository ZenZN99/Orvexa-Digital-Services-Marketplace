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
import { User } from '../../users/schema/user.schema.js';
let Message = class Message extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], Message.prototype, "id", void 0);
__decorate([
    ForeignKey(() => Contract),
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Message.prototype, "contractId", void 0);
__decorate([
    BelongsTo(() => Contract),
    __metadata("design:type", Contract)
], Message.prototype, "contract", void 0);
__decorate([
    ForeignKey(() => User),
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Message.prototype, "senderId", void 0);
__decorate([
    BelongsTo(() => User),
    __metadata("design:type", User)
], Message.prototype, "sender", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
        allowNull: true,
        defaultValue: null,
    }),
    __metadata("design:type", Object)
], Message.prototype, "content", void 0);
__decorate([
    Column({
        type: DataType.JSONB,
        allowNull: false,
        defaultValue: [],
    }),
    __metadata("design:type", Array)
], Message.prototype, "images", void 0);
Message = __decorate([
    Table({
        tableName: 'messages',
        timestamps: true,
        indexes: [
            {
                fields: ['contractId'],
            },
            {
                fields: ['senderId'],
            },
        ],
    })
], Message);
export { Message };
//# sourceMappingURL=message.schema.js.map