import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { TokensService } from './tokens.service';
import { User } from '../user/models/user';
import { UnauthorizedException } from './exceptions/unauthorized.exception';
import { LoginProps, RegisterProps, TokensAndUser } from './types';
import { AlreadyTakenUsernameException } from './exceptions/already-taken-username.exception';
import * as bcrypt from 'bcrypt';
import { WrongCredentialsException } from './exceptions/wrong-credentials.exception';
import { FullUser } from '../user/models/full-user';
import { EventsService } from '../events/events.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly eventsService: EventsService,
    private readonly tokensService: TokensService,
  ) {}

  async login({ username, password }: LoginProps): Promise<TokensAndUser> {
    const user = await this.validateUserByUsername(username);
    await this.comparePasswords(user, password);

    const tokens = await this.tokensService.generateTokens(user.id);
    return { tokens, user };
  }

  async register({
    username,
    password,
  }: RegisterProps): Promise<TokensAndUser> {
    const user = await this.createUser(username, password);
    const tokens = await this.tokensService.generateTokens(user.id);
    return { tokens, user };
  }

  async refresh(refreshToken: string): Promise<TokensAndUser> {
    const { id } = await this.tokensService.decodeRefreshToken(refreshToken);

    const user = await this.validateUserById(id);
    await this.tokensService.validateRefreshToken(id, refreshToken);
    await this.tokensService.makeRefreshTokenInvalid(id, refreshToken);

    const tokens = await this.tokensService.generateTokens(id);
    return { tokens, user };
  }

  async logout(refreshToken: string): Promise<void> {
    const { id } = await this.tokensService.decodeRefreshToken(refreshToken);

    await this.validateUserById(id);
    await this.tokensService.validateRefreshToken(id, refreshToken);
    await this.tokensService.makeRefreshTokenInvalid(id, refreshToken);
  }

  private async validateUserById(id: User['id']): Promise<User> {
    const existingUser = await this.userService.getUserById(id);

    if (!existingUser) throw new UnauthorizedException();
    return existingUser;
  }

  private async createUser(username: string, password: string): Promise<User> {
    const existingUser = await this.userService.getUserByUsername(username);
    if (existingUser) {
      throw new AlreadyTakenUsernameException();
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await this.userService.createUser({
      username,
      passwordHash,
    });

    return user;
  }

  private async comparePasswords(
    user: FullUser,
    password: string,
  ): Promise<void> {
    try {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password_hash,
      );

      if (!isPasswordCorrect) throw new WrongCredentialsException();
    } catch {
      throw new WrongCredentialsException();
    }
  }

  private async validateUserByUsername(username: string): Promise<FullUser> {
    const user =
      await this.userService._getUserWithSensetiveDataByUsername(username);
    if (!user) {
      throw new WrongCredentialsException();
    }
    return user;
  }
}
