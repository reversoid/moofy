import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'jsonwebtoken';
import { Strategy } from 'passport-jwt';
import secretsConfig from 'src/config/secrets.config';
import { AccessTokenPayload } from './tokens-payload.type';
import { FastifyRequest } from 'fastify';

const bearerTokenPattern = /^Bearer\s+(\S+)$/i;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(secretsConfig.KEY)
    config: ConfigType<typeof secretsConfig>,
  ) {
    super({
      jwtFromRequest: (request: FastifyRequest) => {
        const authHeader = request.headers['authorization'];
        if (!authHeader) {
          return null;
        }

        const match = authHeader.match(bearerTokenPattern);

        return match ? match[1] : null;
      },
      ignoreExpiration: false,
      secretOrKey: config.jwt,
    });
  }

  async validate({ id }: JwtPayload & AccessTokenPayload) {
    return id;
  }
}
