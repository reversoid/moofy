import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EventsService } from 'src/modules/events/events.service';
import { FullUser } from 'src/modules/user/models/full-user';
import { User } from 'src/modules/user/models/user';
import { UserService } from 'src/modules/user/user.service';
import { AlreadyTakenUsernameException } from './exceptions/already-taken-username.exception';
import { WrongCredentialsException } from './exceptions/wrong-credentials.exception';
import { LoginProps, TokensAndUser, RegisterProps } from './types';
import { TokensService } from './utils/tokens.service';
import * as bcrypt from 'bcrypt';

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

    this.eventsService.createUserEvent({
      targetId: user.id,
      type: 'USER_REGISTERED',
    });

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
        user.passwordHash,
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
