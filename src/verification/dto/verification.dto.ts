import { IsOptional, IsString } from 'class-validator';

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
