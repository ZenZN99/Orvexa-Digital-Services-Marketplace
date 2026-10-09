import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { dtoMessages } from '../../../../common/libs/dto-messages.js';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserProfileDTO {
  @ApiProperty({
    example: "Hello I'm Zen Allaham a Software Engineer",
    required: false,
    minLength: 3,
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: dtoMessages.userProfile.bio.isString })
  @MinLength(3, { message: dtoMessages.userProfile.bio.minLength })
  @MaxLength(254, { message: dtoMessages.userProfile.bio.maxLength })
  bio?: string;
}
