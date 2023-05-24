import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { getJWTConfig } from './configs/getJWTConfig';
import * as bcrypt from 'bcrypt';
import { AuthErrors } from 'src/errors/auth.errors';
import { HttpException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  const anyUser = new User('some name', 'someEmail', 'some hash');

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [JwtModule.registerAsync(getJWTConfig())],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
      controllers: [AuthController],
    }).compile();

    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('UserRepository', () => {
    it('should be defined', () => {
      expect(userRepository).toBeDefined();
    });
  });

  describe('Register', () => {
    const registerCredentials = {
      email: 'mail@mail.ru',
      password: 'password',
      username: 'George',
    };
    const hashedPassword = 'hashedPasword';

    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(() => Promise.resolve(hashedPassword));

    it('should call bcrypt hash', async () => {
      await service.createUser(registerCredentials);

      expect(bcrypt.hash).toHaveBeenCalledWith(
        registerCredentials.password,
        expect.any(Number),
      );
    });

    it('should save entity with correct user data and hashed password', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      await service.createUser(registerCredentials);

      expect(userRepository.save).toHaveBeenCalledWith({
        email: registerCredentials.email,
        username: registerCredentials.username,
        password_hash: hashedPassword,
      });
    });

    it('should throw error when the user exists', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(anyUser);

      await expect(service.createUser(registerCredentials)).rejects.toThrow(
        new HttpException(AuthErrors.EMAIL_ALREADY_TAKEN, 409),
      );
    });

    it('should return user when registration is successful', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);
      jest
        .spyOn(userRepository, 'save')
        .mockResolvedValue(
          new User(
            registerCredentials.username,
            registerCredentials.email,
            hashedPassword,
          ),
        );

      await expect(
        service.createUser(registerCredentials),
      ).resolves.toBeInstanceOf(User);
    });
  });
  describe('Login', () => {
    const correctEmail = 'mail@mail.com';
    const correctPassword = 'password';

    const incorrectEmail = 'email@mail.ru';
    const incorrectPassword = '123password';

    it('should throw error when the user does not exist', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      await expect(
        service.validateUser({
          email: incorrectEmail,
          password: incorrectPassword,
        }),
      ).rejects.toThrow(new HttpException(AuthErrors.WRONG_CREDENTIALS, 400));
    });

    it('should throw error when the password is incorrect', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(anyUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => {
        throw new Error();
      });

      await expect(
        service.validateUser({
          email: incorrectEmail,
          password: incorrectPassword,
        }),
      ).rejects.toThrow(new HttpException(AuthErrors.WRONG_CREDENTIALS, 400));
    });

    it('should return user when credentials are correct', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(
          new User('George', correctEmail, 'somePasswordHash'),
        );
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));

      await expect(
        service.validateUser({
          email: correctEmail,
          password: correctPassword,
        }),
      ).resolves.toBeInstanceOf(User);
    });
  });
});
