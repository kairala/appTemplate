import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../../../db/models/user/user.model';
import { ValidateUserResponseDto } from '../dto/validate/response.dto';

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(user: User): Promise<ValidateUserResponseDto> {
    return new Promise((resolve) => {
      resolve({
        id: user.id,
        email: user.email,
        provider: user.provider,
        name: user.name,
      });
    });
  }
}
