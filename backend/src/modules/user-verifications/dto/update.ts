import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { UserVerificationStatus } from '../../../common/enums/user-verification.enum.js';

import { dtoMessages } from '../../../common/libs/dto-messages.js';

export class UpdateUserVerificationDTO {
  @ApiProperty({
    enum: UserVerificationStatus,
    example: UserVerificationStatus.APPROVED,
  })
  @IsEnum(UserVerificationStatus, {
    message: dtoMessages.userVerification.status.isEnum,
  })
  status: UserVerificationStatus;

  @ApiPropertyOptional({
    example:
      'The identity document is not clear. Please upload a clearer image.',
    maxLength: 500,
    nullable: true,
  })
  @IsOptional()
  @IsString({
    message: dtoMessages.userVerification.rejectionReason.isString,
  })
  @MaxLength(500, {
    message: dtoMessages.userVerification.rejectionReason.maxLength,
  })
  rejectionReason?: string;
}
