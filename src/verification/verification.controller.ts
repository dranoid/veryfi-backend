import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { VerificationService } from './verification.service';
import { verificationDTO } from './dto/verification.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('verification')
export class VerificationController {
  constructor(private verificationService: VerificationService) {}

  //   @Get('token')
  //   async getToken() {
  //     try {
  //       const tokenInfo = await this.verificationService.getAccessToken();
  //       if (!tokenInfo) {
  //         throw new Error('Token is undefined');
  //       }
  //       return tokenInfo;
  //     } catch (error) {
  //       console.error('Controller error:', error.message);
  //       return { error: error.message || 'Failed to obtain token' };
  //     }
  //   }

  @UseGuards(JwtAuthGuard)
  @Post()
  async verifyNumber(@Body() verificationDto: verificationDTO) {
    return await this.verificationService.verifyNumber(verificationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('status/:id')
  async getVerificationStatus(@Param('id') id: string) {
    return await this.verificationService.checkVerificationStatus(id);
  }

  @Post('webhook')
  async handleWebhook(@Body() webhookData: any) {
    return await this.verificationService.processWebhook(webhookData);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me')
  async updateUserPhone(@Req() req, @Body('number') number: string) {
    const userId = req.user.id; // Assuming the user ID is attached to the request by the JwtAuthGuard
    return await this.verificationService.updateAndVerifyUserPhone(
      userId,
      number,
    );
  }
}
