import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import secretsConfig from 'src/config/secrets.config';
import { AccessTokenPayload } from '../passport/token-payload.type';

/** Provides logic for validating access token */
@Injectable()
export class ValidationService {
  constructor(
    @Inject(secretsConfig.KEY)
    private readonly config: ConfigType<typeof secretsConfig>,
    private readonly jwtService: JwtService,
  ) {}
  private jwtSecret = this.config.jwt;

  async validateAccessToken(token: string): Promise<AccessTokenPayload> {
    try {
      const decoded = await this.jwtService.verifyAsync<AccessTokenPayload>(
        token,
        { secret: this.jwtSecret },
      );
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
