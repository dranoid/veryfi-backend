import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
// import { User } from 'src/user/entity/user.entity';
// import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    // @InjectRepository(User)
    // private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
  //   async validate(payload: any): Promise<any> {
  //     const { email } = payload;
  //     const user = await this.userRepository.findOne({ email });

  //     if (!user) {
  //       throw new Error('Unauthorized');
  //     }

  //     return { userId: payload.sub, email: payload.email };
  //   }
}
