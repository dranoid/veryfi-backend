import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as qs from 'qs';
import { verificationDTO } from './dto/verification.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class VerificationService {
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(
    private readonly configService: ConfigService,
    private httpService: HttpService,
    private readonly userService: UserService,
  ) {
    this.clientId = this.configService.get('CLIENT_ID');
    this.clientSecret = this.configService.get('CLIENT_SECRET');
  }

  async getAccessToken() {
    const data = qs.stringify({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      scope: 'otp:verify otp:send',
      grant_type: 'client_credentials',
    });

    try {
      const response = await lastValueFrom(
        this.httpService.post('https://api.zamry.com/oauth/token', data, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      );
      if (!response.data.accessToken) {
        throw new Error('Access token not found in response');
      }
      return response.data;
    } catch (error) {
      console.error(
        'Failed to obtain access token:',
        error.response?.data || error.message,
      );
      throw new Error('Failed to obtain access token');
    }
  }

  async verifyNumber(verificationDto: verificationDTO) {
    try {
      const tokenResponse = await this.getAccessToken();
      const accessToken = tokenResponse.accessToken;

      if (!accessToken) {
        throw new Error('Failed to obtain access token');
      }

      // Prepare the data for the OTP request
      const data = JSON.stringify({
        countryCode: verificationDto.countryCode,
        phoneNumber: verificationDto.phoneNumber,
        type: verificationDto.type,
        // webhookUrl: verificationDto.webhookUrl,
        // reference: verificationDto.reference,
      });

      // Make the OTP request
      const response = await lastValueFrom(
        this.httpService.post('https://api.zamry.com/v1/otp/request', data, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }),
      );

      return response.data;
    } catch (error) {
      console.error(
        'Verification failed:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Verification request failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkVerificationStatus(otpId: string) {
    try {
      // First, get the access token
      const tokenResponse = await this.getAccessToken();
      const accessToken = tokenResponse.accessToken;

      if (!accessToken) {
        throw new Error('Failed to obtain access token');
      }

      // Make the GET request to check OTP status
      const response = await lastValueFrom(
        this.httpService.get(`https://api.zamry.com/v1/otp/${otpId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );

      return response.data;
    } catch (error) {
      console.error(
        'OTP status check failed:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'OTP status check failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async processWebhook(webhookData: any) {
    // Process the webhook data
    console.log('Received webhook:', webhookData);
    // looks like this
    // "status": true,
    //     "message": "otp fetched successfully",
    //     "data": {
    //         "id": "6af950fe-fa7a-4ec2-ba12-a57857073933",
    //         "createdAt": "2024-07-23T04:05:31.843Z",
    //         "updatedAt": "2024-07-23T04:06:29.684Z",
    //         "otp": "0000",
    //         "phoneNumber": "08166570313",
    //         "country": "+234",
    //         "countryCode": "+234",
    //         "counter": 0,
    //         "pairedNumber": "09167142035",
    //         "type": "DROPPED_CALL",
    //         "status": "SUCCESS",
    //         "webhookUrl": null
    //     }
    // }

    // Here you would typically update the verification status in your database
    // based on the webhook data

    return { message: 'Webhook processed successfully' };
  }

  async updateAndVerifyUserPhone(userId: string, phoneNumber: string) {
    // Update user's phone number
    await this.userService.updateUserPhone(userId, phoneNumber);

    // Start verification process
    const verificationDto: verificationDTO = {
      countryCode: '+234', // You might want to make this dynamic or get it from the user
      phoneNumber: phoneNumber,
      type: 'DROPPED_CALL', // or whatever type you're using
    };

    const verificationResult = await this.verifyNumber(verificationDto);

    return {
      message: 'Phone number updated and verification initiated',
      verificationResult,
    };
  }
}