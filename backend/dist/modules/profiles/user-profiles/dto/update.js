var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { dtoMessages } from '../../../../common/libs/dto-messages.js';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateUserProfileDTO {
    bio;
}
__decorate([
    ApiProperty({
        example: "Hello I'm Zen Allaham a Software Engineer",
        required: false,
        minLength: 3,
        maxLength: 500,
    }),
    IsOptional(),
    IsString({ message: dtoMessages.userProfile.bio.isString }),
    MinLength(3, { message: dtoMessages.userProfile.bio.minLength }),
    MaxLength(254, { message: dtoMessages.userProfile.bio.maxLength }),
    __metadata("design:type", String)
], UpdateUserProfileDTO.prototype, "bio", void 0);
//# sourceMappingURL=update.js.map