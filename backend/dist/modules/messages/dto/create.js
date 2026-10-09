var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { dtoMessages } from '../../../common/libs/dto-messages.js';
export class CreateMessageDTO {
    content;
}
__decorate([
    ApiPropertyOptional({
        example: 'Here is the updated design. Please check the new version.',
        minLength: 1,
        maxLength: 5000,
        nullable: true,
    }),
    IsOptional(),
    IsString({
        message: dtoMessages.message.content.isString,
    }),
    IsNotEmpty({
        message: dtoMessages.message.content.isNotEmpty,
    }),
    MaxLength(5000, {
        message: dtoMessages.message.content.maxLength,
    }),
    __metadata("design:type", String)
], CreateMessageDTO.prototype, "content", void 0);
//# sourceMappingURL=create.js.map