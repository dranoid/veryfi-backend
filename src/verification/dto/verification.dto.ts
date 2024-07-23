import { IsEnum, IsOptional, IsString } from 'class-validator';

enum verification_type {
  DROPPED_CALL = 'DROPPED_CALL',
  SEND_SMS = 'SEND_SMS',
}

export class verificationDTO {
  @IsString()
  countryCode: string;

  @IsString()
  phoneNumber: string;

  @IsEnum(verification_type)
  type: verification_type;

  @IsString()
  @IsOptional()
  webhookUrl?: string;

  @IsString()
  @IsOptional()
  reference?: string;
}

export class SelfVerificationDTO {
  @IsString()
  number: string;

  @IsEnum(verification_type)
  type: verification_type;
}
