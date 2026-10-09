var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserVerificationStatus } from '../../../common/enums/user-verification.enum.js';
import { dtoMessages } from '../../../common/libs/dto-messages.js';
export class UpdateUserVerificationDTO {
    status;
    rejectionReason;
}
__decorate([
    ApiProperty({
        enum: UserVerificationStatus,
        example: UserVerificationStatus.APPROVED,
    }),
    IsEnum(UserVerificationStatus, {
        message: dtoMessages.userVerification.status.isEnum,
    }),
    __metadata("design:type", String)
], UpdateUserVerificationDTO.prototype, "status", void 0);
__decorate([
    ApiPropertyOptional({
        example: 'The identity document is not clear. Please upload a clearer image.',
        maxLength: 500,
        nullable: true,
    }),
    IsOptional(),
    IsString({
        message: dtoMessages.userVerification.rejectionReason.isString,
    }),
    MaxLength(500, {
        message: dtoMessages.userVerification.rejectionReason.maxLength,
    }),
    __metadata("design:type", String)
], UpdateUserVerificationDTO.prototype, "rejectionReason", void 0);
//# sourceMappingURL=update.js.map