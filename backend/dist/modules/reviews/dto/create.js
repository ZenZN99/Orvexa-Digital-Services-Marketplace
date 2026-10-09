var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min, MinLength, } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { dtoMessages } from '../../../common/libs/dto-messages.js';
import { Type } from 'class-transformer';
export class CreateReviewDTO {
    rating;
    comment;
}
__decorate([
    ApiProperty({
        example: 5,
        minimum: 1,
        maximum: 5,
    }),
    Type(() => Number),
    IsInt({
        message: dtoMessages.review.rating.isInt,
    }),
    Min(1, {
        message: dtoMessages.review.rating.min,
    }),
    Max(5, {
        message: dtoMessages.review.rating.max,
    }),
    __metadata("design:type", Number)
], CreateReviewDTO.prototype, "rating", void 0);
__decorate([
    ApiProperty({
        example: 'Excellent service. The project was delivered professionally and on time.',
        required: false,
        minLength: 10,
        maxLength: 1000,
    }),
    IsOptional(),
    IsString({
        message: dtoMessages.review.comment.isString,
    }),
    IsNotEmpty({
        message: dtoMessages.review.comment.isNotEmpty,
    }),
    MinLength(10, {
        message: dtoMessages.review.comment.minLength,
    }),
    MaxLength(200, {
        message: dtoMessages.review.comment.maxLength,
    }),
    __metadata("design:type", String)
], CreateReviewDTO.prototype, "comment", void 0);
//# sourceMappingURL=create.js.map