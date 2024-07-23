import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  name: string;
}

export class LoginDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
