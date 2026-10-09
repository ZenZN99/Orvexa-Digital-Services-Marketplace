var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, IsEnum, IsInt, IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength, } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ServiceCategory } from '../../../common/enums/service.enum.js';
import { dtoMessages } from '../../../common/libs/dto-messages.js';
import { Type } from 'class-transformer';
export class CreateServiceDTO {
    category;
    title;
    description;
    features;
    keywords;
    price;
    deliveryDays;
}
__decorate([
    ApiProperty({
        enum: ServiceCategory,
        example: ServiceCategory.PROGRAMMING,
    }),
    IsEnum(ServiceCategory, {
        message: dtoMessages.service.category.isEnum,
    }),
    __metadata("design:type", String)
], CreateServiceDTO.prototype, "category", void 0);
__decorate([
    ApiProperty({
        example: 'I will develop a professional REST API using NestJS',
        minLength: 10,
        maxLength: 150,
    }),
    IsString({
        message: dtoMessages.service.title.isString,
    }),
    IsNotEmpty({
        message: dtoMessages.service.title.isNotEmpty,
    }),
    MinLength(10, {
        message: dtoMessages.service.title.minLength,
    }),
    MaxLength(150, {
        message: dtoMessages.service.title.maxLength,
    }),
    __metadata("design:type", String)
], CreateServiceDTO.prototype, "title", void 0);
__decorate([
    ApiProperty({
        example: 'I will develop a secure and scalable REST API using NestJS and PostgreSQL with authentication and Swagger documentation.',
        minLength: 50,
        maxLength: 5000,
    }),
    IsString({
        message: dtoMessages.service.description.isString,
    }),
    IsNotEmpty({
        message: dtoMessages.service.description.isNotEmpty,
    }),
    MinLength(50, {
        message: dtoMessages.service.description.minLength,
    }),
    MaxLength(5000, {
        message: dtoMessages.service.description.maxLength,
    }),
    __metadata("design:type", String)
], CreateServiceDTO.prototype, "description", void 0);
__decorate([
    ApiProperty({
        type: [String],
        example: [
            'RESTful API',
            'JWT Authentication',
            'PostgreSQL Database',
            'Swagger Documentation',
        ],
        minItems: 1,
        maxItems: 10,
    }),
    IsArray({
        message: dtoMessages.service.features.isArray,
    }),
    ArrayMinSize(1, {
        message: dtoMessages.service.features.minSize,
    }),
    ArrayMaxSize(10, {
        message: dtoMessages.service.features.maxSize,
    }),
    ArrayUnique({
        message: dtoMessages.service.features.unique,
    }),
    IsString({
        each: true,
        message: dtoMessages.service.features.isString,
    }),
    __metadata("design:type", Array)
], CreateServiceDTO.prototype, "features", void 0);
__decorate([
    ApiProperty({
        type: [String],
        example: ['NestJS', 'Node.js', 'PostgreSQL', 'REST API', 'Backend'],
        minItems: 1,
        maxItems: 5,
    }),
    IsArray({
        message: dtoMessages.service.keywords.isArray,
    }),
    ArrayMinSize(1, {
        message: dtoMessages.service.keywords.minSize,
    }),
    ArrayMaxSize(10, {
        message: dtoMessages.service.keywords.maxSize,
    }),
    ArrayUnique({
        message: dtoMessages.service.keywords.unique,
    }),
    IsString({
        each: true,
        message: dtoMessages.service.keywords.isString,
    }),
    __metadata("design:type", Array)
], CreateServiceDTO.prototype, "keywords", void 0);
__decorate([
    ApiProperty({
        example: 50,
        minimum: 1,
    }),
    Type(() => Number),
    IsNumber({}, {
        message: dtoMessages.service.price.isNumber,
    }),
    Min(1, {
        message: dtoMessages.service.price.min,
    }),
    __metadata("design:type", Number)
], CreateServiceDTO.prototype, "price", void 0);
__decorate([
    ApiProperty({
        example: 5,
        minimum: 1,
        maximum: 90,
    }),
    Type(() => Number),
    IsInt({
        message: dtoMessages.service.deliveryDays.isInt,
    }),
    Min(1, {
        message: dtoMessages.service.deliveryDays.min,
    }),
    Max(90, {
        message: dtoMessages.service.deliveryDays.max,
    }),
    __metadata("design:type", Number)
], CreateServiceDTO.prototype, "deliveryDays", void 0);
//# sourceMappingURL=create.js.map