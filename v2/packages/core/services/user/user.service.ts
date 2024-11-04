import { err, ok, Result } from "resulto";
import { User } from "../../entities/user";
import { Id } from "../../utils/id";
import { UsernameExistsError } from "./errors";
import { IUserService } from "./interface";
import { IUserRepository } from "../../repositories/user.repository";
import { hashPassword } from "../../utils/password";

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async createUser(
    username: string,
    password: string
  ): Promise<Result<User, UsernameExistsError>> {
    const passwordHash = await hashPassword(password);
    const newUser = User.create({ username, passwordHash });

    try {
      const savedUser = await this.userRepository.create(newUser);
      return ok(savedUser);
    } catch {
      return err(new UsernameExistsError());
    }
  }

  async getUser(id: Id): Promise<User | null> {
    const user = await this.userRepository.get(id);
    return user;
  }
}
