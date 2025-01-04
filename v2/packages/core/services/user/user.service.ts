import { err, ok, Result } from "resulto";
import { User } from "../../entities/user";
import { Id } from "../../utils/id";
import { UsernameExistsError } from "./errors";
import { IUserService } from "./interface";
import { IUserRepository } from "../../repositories/user.repository";
import { comparePasswords, hashPassword } from "../../utils/password";

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async searchUsers(search: string, limit: number): Promise<User[]> {
    const users = await this.userRepository.searchUsers(search, limit);
    return users;
  }

  async createUser(
    username: string,
    password: string
  ): Promise<Result<User, UsernameExistsError>> {
    const passwordHash = await hashPassword(password);
    const newUser = new User({ username, passwordHash });

    const existingUser = await this.userRepository.getByUsername(username);
    if (existingUser) {
      return err(new UsernameExistsError());
    }

    const savedUser = await this.userRepository.create(newUser);
    return ok(savedUser);
  }

  async getUser(id: Id): Promise<User | null> {
    const user = await this.userRepository.get(id);
    return user;
  }

  async validateUserAndPassword(
    username: string,
    password: string
  ): Promise<User | null> {
    const user = await this.userRepository.getByUsername(username);
    if (!user) {
      return null;
    }

    if (await comparePasswords(password, user.passwordHash)) {
      return user;
    }

    return null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const user = await this.userRepository.getByUsername(username);
    return user;
  }
}
