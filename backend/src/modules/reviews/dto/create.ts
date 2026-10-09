import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { dtoMessages } from '../../../common/libs/dto-messages.js';
import { Type } from 'class-transformer';

export class CreateReviewDTO {
  @ApiProperty({
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @Type(() => Number)
  @IsInt({
    message: dtoMessages.review.rating.isInt,
  })
  @Min(1, {
    message: dtoMessages.review.rating.min,
  })
  @Max(5, {
    message: dtoMessages.review.rating.max,
  })
  rating: number;

  @ApiProperty({
    example:
      'Excellent service. The project was delivered professionally and on time.',
    required: false,
    minLength: 10,
    maxLength: 1000,
  })
  @IsOptional()
  @IsString({
    message: dtoMessages.review.comment.isString,
  })
  @IsNotEmpty({
    message: dtoMessages.review.comment.isNotEmpty,
  })
  @MinLength(10, {
    message: dtoMessages.review.comment.minLength,
  })
  @MaxLength(200, {
    message: dtoMessages.review.comment.maxLength,
  })
  comment?: string;
}
