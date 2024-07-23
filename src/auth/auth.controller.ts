import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body(ValidationPipe) signUpDto: SignUpDto) {
    const { user, accessToken } = await this.authService.signUp(signUpDto);
    return {
      message: 'User created successfully',
      user: user,
      accessToken,
    };
  }

  @Post('login')
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }
}
