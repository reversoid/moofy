import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import secretsConfig from 'src/config/secrets.config';
import { AccessTokenPayload } from './tokens-payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(secretsConfig.KEY)
    config: ConfigType<typeof secretsConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt,
    });
  }

  async validate({ id }: JwtPayload & AccessTokenPayload) {
    return id;
  }
}
