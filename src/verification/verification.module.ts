import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from 'src/user/user.module';
import { VerificationGateway } from 'src/websockets/verification.gateway';

@Module({
  imports: [HttpModule, UserModule],
  providers: [VerificationService, VerificationGateway],
  controllers: [VerificationController],
})
export class VerificationModule {}
