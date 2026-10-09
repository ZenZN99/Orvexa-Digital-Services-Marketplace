import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { dtoMessages } from '../../../common/libs/dto-messages.js';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({ example: 'user@example.com', required: true })
  @IsEmail({}, { message: dtoMessages.auth.email.isEmail })
  @IsNotEmpty({ message: dtoMessages.auth.email.isNotEmpty })
  email!: string;

  @ApiProperty({
    example: 'Password12345!',
    required: true,
    minLength: 8,
    maxLength: 40,
  })
  @IsString({ message: dtoMessages.auth.password.isString })
  @IsNotEmpty({ message: dtoMessages.auth.password.isNotEmpty })
  @MinLength(8, { message: dtoMessages.auth.password.minLength })
  @MaxLength(40, { message: dtoMessages.auth.password.maxLength })
  password!: string;
}
