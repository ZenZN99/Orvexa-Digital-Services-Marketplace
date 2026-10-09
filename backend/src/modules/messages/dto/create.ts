import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { dtoMessages } from '../../../common/libs/dto-messages.js';

export class CreateMessageDTO {
  @ApiPropertyOptional({
    example: 'Here is the updated design. Please check the new version.',
    minLength: 1,
    maxLength: 5000,
    nullable: true,
  })
  @IsOptional()
  @IsString({
    message: dtoMessages.message.content.isString,
  })
  @IsNotEmpty({
    message: dtoMessages.message.content.isNotEmpty,
  })
  @MaxLength(5000, {
    message: dtoMessages.message.content.maxLength,
  })
  content?: string;
}
