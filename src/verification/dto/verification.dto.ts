import { IsEnum, IsOptional, IsString } from 'class-validator';

export class verificationDTO {
  @IsString()
  countryCode: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  type: string;

  @IsString()
  @IsOptional()
  webhookUrl?: string;

  @IsString()
  @IsOptional()
  reference?: string;
}

enum verification_type {
  DROPPED_CALL = 'DROPPED_CALL',
  SEND_SMS = 'SEND_SMS',
}

export class SelfVerificationDTO {
  @IsString()
  number: string;

  @IsEnum(verification_type)
  type: verification_type;
}
