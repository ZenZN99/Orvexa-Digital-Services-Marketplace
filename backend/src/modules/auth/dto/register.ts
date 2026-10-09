import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../../common/enums/user.enum.js';
import { dtoMessages } from '../../../common/libs/dto-messages.js';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDTO {
  @ApiProperty({ example: 'Zen', required: true, minLength: 3, maxLength: 50 })
  @IsString({ message: dtoMessages.auth.firstName.isString })
  @IsNotEmpty({ message: dtoMessages.auth.firstName.isNotEmpty })
  @MinLength(3, { message: dtoMessages.auth.firstName.minLength })
  @MaxLength(50, { message: dtoMessages.auth.firstName.maxLength })
  firstName!: string;

  @ApiProperty({
    example: 'Allaham',
    required: true,
    minLength: 3,
    maxLength: 50,
  })
  @IsString({ message: dtoMessages.auth.lastName.isString })
  @IsNotEmpty({ message: dtoMessages.auth.lastName.isNotEmpty })
  @MinLength(3, { message: dtoMessages.auth.lastName.minLength })
  @MaxLength(50, { message: dtoMessages.auth.lastName.maxLength })
  lastName!: string;

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
  @MinLength(8, { message: dtoMessages.auth.password.maxLength })
  @MaxLength(40, { message: dtoMessages.auth.password.minLength })
  password!: string;

  @ApiProperty({ enum: UserRole, required: true, default: UserRole.FREELANCER })
  @IsNotEmpty({ message: dtoMessages.auth.role.isNotEmpty })
  @IsEnum(UserRole, { message: dtoMessages.auth.role.isEnum })
  role!: UserRole;
}
