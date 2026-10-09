import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { JobTitle, Skills } from '../../../../common/enums/freelancer.enum.js';
import { dtoMessages } from '../../../../common/libs/dto-messages.js';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFreelancerDTO {
  @ApiProperty({
    enum: JobTitle,
    required: false,
    example: JobTitle.SOFTWARE_ENGINEER,
  })
  @IsOptional()
  @IsEnum(JobTitle, {
    message: dtoMessages.freelancer.jobTitle.isEnum,
  })
  jobTitle?: JobTitle;

  @ApiProperty({
    required: false,
    example: 'Hello, I’m Zen, a software engineer, and I sell micro-services.',
    minLength: 3,
    maxLength: 500,
  })
  @IsOptional()
  @IsString({
    message: dtoMessages.freelancer.about.isString,
  })
  @MinLength(3, {
    message: dtoMessages.freelancer.about.minLength,
  })
  @MaxLength(500, {
    message: dtoMessages.freelancer.about.maxLength,
  })
  about?: string;

  @ApiProperty({
    required: false,
    enum: Skills,
    isArray: true,
    example: [
      Skills.NEST_JS,
      Skills.TYPESCRIPT,
      Skills.POSTGRESQL,
      Skills.ANGULAR,
    ],
    maxItems: 10,
  })
  @IsOptional()
  @IsArray({
    message: dtoMessages.freelancer.skills.isArray,
  })
  @ArrayMaxSize(10, {
    message: dtoMessages.freelancer.skills.maxSize,
  })
  @ArrayUnique({
    message: dtoMessages.freelancer.skills.unique,
  })
  @IsEnum(Skills, {
    each: true,
    message: dtoMessages.freelancer.skills.isEnum,
  })
  skills?: Skills[];

  @ApiProperty({
    required: false,
    example: 'https://example.com',
    maxLength: 255,
  })
  @IsOptional()
  @IsString({
    message: dtoMessages.freelancer.website.isString,
  })
  @MaxLength(255, {
    message: dtoMessages.freelancer.website.maxLength,
  })
  website?: string;
}
