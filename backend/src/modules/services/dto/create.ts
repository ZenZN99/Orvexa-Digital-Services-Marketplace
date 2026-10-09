import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ServiceCategory } from '../../../common/enums/service.enum.js';
import { dtoMessages } from '../../../common/libs/dto-messages.js';
import { Type } from 'class-transformer';

export class CreateServiceDTO {
  @ApiProperty({
    enum: ServiceCategory,
    example: ServiceCategory.PROGRAMMING,
  })
  @IsEnum(ServiceCategory, {
    message: dtoMessages.service.category.isEnum,
  })
  category: ServiceCategory;

  @ApiProperty({
    example: 'I will develop a professional REST API using NestJS',
    minLength: 10,
    maxLength: 150,
  })
  @IsString({
    message: dtoMessages.service.title.isString,
  })
  @IsNotEmpty({
    message: dtoMessages.service.title.isNotEmpty,
  })
  @MinLength(10, {
    message: dtoMessages.service.title.minLength,
  })
  @MaxLength(150, {
    message: dtoMessages.service.title.maxLength,
  })
  title: string;

  @ApiProperty({
    example:
      'I will develop a secure and scalable REST API using NestJS and PostgreSQL with authentication and Swagger documentation.',
    minLength: 50,
    maxLength: 5000,
  })
  @IsString({
    message: dtoMessages.service.description.isString,
  })
  @IsNotEmpty({
    message: dtoMessages.service.description.isNotEmpty,
  })
  @MinLength(50, {
    message: dtoMessages.service.description.minLength,
  })
  @MaxLength(5000, {
    message: dtoMessages.service.description.maxLength,
  })
  description: string;

  @ApiProperty({
    type: [String],
    example: [
      'RESTful API',
      'JWT Authentication',
      'PostgreSQL Database',
      'Swagger Documentation',
    ],
    minItems: 1,
    maxItems: 10,
  })
  @IsArray({
    message: dtoMessages.service.features.isArray,
  })
  @ArrayMinSize(1, {
    message: dtoMessages.service.features.minSize,
  })
  @ArrayMaxSize(10, {
    message: dtoMessages.service.features.maxSize,
  })
  @ArrayUnique({
    message: dtoMessages.service.features.unique,
  })
  @IsString({
    each: true,
    message: dtoMessages.service.features.isString,
  })
  features: string[];

  @ApiProperty({
    type: [String],
    example: ['NestJS', 'Node.js', 'PostgreSQL', 'REST API', 'Backend'],
    minItems: 1,
    maxItems: 5,
  })
  @IsArray({
    message: dtoMessages.service.keywords.isArray,
  })
  @ArrayMinSize(1, {
    message: dtoMessages.service.keywords.minSize,
  })
  @ArrayMaxSize(10, {
    message: dtoMessages.service.keywords.maxSize,
  })
  @ArrayUnique({
    message: dtoMessages.service.keywords.unique,
  })
  @IsString({
    each: true,
    message: dtoMessages.service.keywords.isString,
  })
  keywords: string[];

  @ApiProperty({
    example: 50,
    minimum: 1,
  })
  @Type(() => Number)
  @IsNumber(
    {},
    {
      message: dtoMessages.service.price.isNumber,
    },
  )
  @Min(1, {
    message: dtoMessages.service.price.min,
  })
  price: number;

  @ApiProperty({
    example: 5,
    minimum: 1,
    maximum: 90,
  })
  @Type(() => Number)
  @IsInt({
    message: dtoMessages.service.deliveryDays.isInt,
  })
  @Min(1, {
    message: dtoMessages.service.deliveryDays.min,
  })
  @Max(90, {
    message: dtoMessages.service.deliveryDays.max,
  })
  deliveryDays: number;
}
