var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, } from 'class-validator';
import { dtoMessages } from '../../../common/libs/dto-messages.js';
import { ApiProperty } from '@nestjs/swagger';
export class LoginDTO {
    email;
    password;
}
__decorate([
    ApiProperty({ example: 'user@example.com', required: true }),
    IsEmail({}, { message: dtoMessages.auth.email.isEmail }),
    IsNotEmpty({ message: dtoMessages.auth.email.isNotEmpty }),
    __metadata("design:type", String)
], LoginDTO.prototype, "email", void 0);
__decorate([
    ApiProperty({
        example: 'Password12345!',
        required: true,
        minLength: 8,
        maxLength: 40,
    }),
    IsString({ message: dtoMessages.auth.password.isString }),
    IsNotEmpty({ message: dtoMessages.auth.password.isNotEmpty }),
    MinLength(8, { message: dtoMessages.auth.password.minLength }),
    MaxLength(40, { message: dtoMessages.auth.password.maxLength }),
    __metadata("design:type", String)
], LoginDTO.prototype, "password", void 0);
//# sourceMappingURL=login.js.map