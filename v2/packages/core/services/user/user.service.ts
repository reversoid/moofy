import { err, ok, Result } from "resulto";
import { User } from "../../entities/user";
import { Id } from "../../utils/id";
import {
  UsernameExistsError,
  UserNotFoundError,
  WrongPasswordError,
} from "./errors";
import { IUserService, UpdateUserDto } from "./interface";
import { IUserRepository } from "../../repositories/user.repository";
import { comparePasswords, hashPassword } from "../../utils/password";

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async searchUsers(props: { search: string; limit: number }): Promise<User[]> {
    if (!props.search) {
      return this.userRepository.getOldestUsers(props.limit);
    }
    return this.userRepository.searchUsers(props.search, props.limit);
  }

  async createUser(props: {
    username: string;
    password: string;
  }): Promise<Result<User, UsernameExistsError>> {
    const passwordHash = await hashPassword(props.password);
    const newUser = new User({ username: props.username, passwordHash });

    const existingUser = await this.userRepository.getByUsername(
      props.username
    );
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

  async validateUserAndPassword(props: {
    username: string;
    password: string;
  }): Promise<Result<User, UserNotFoundError | WrongPasswordError>> {
    const user = await this.userRepository.getByUsername(props.username);
    if (!user) {
      return err(new UserNotFoundError());
    }

    if (await comparePasswords(props.password, user.passwordHash)) {
      return ok(user);
    }

    return err(new WrongPasswordError());
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const user = await this.userRepository.getByUsername(username);
    return user;
  }

  async updateUser(props: {
    id: Id;
    data: UpdateUserDto;
  }): Promise<Result<User, UserNotFoundError>> {
    const existingUser = await this.userRepository.get(props.id);
    if (!existingUser) {
      return err(new UserNotFoundError());
    }

    if (props.data.username) {
      const existingUserWithUsername = await this.userRepository.getByUsername(
        props.data.username
      );
      if (existingUserWithUsername) {
        return err(new UsernameExistsError());
      }
    }

    const newPasswordHash = props.data.password
      ? await hashPassword(props.data.password)
      : undefined;

    const updatedUser = await this.userRepository.update(props.id, {
      imageUrl: props.data.imageUrl,
      description: props.data.description,
      username: props.data.username,
      passwordHash: newPasswordHash,
    });

    return ok(updatedUser);
  }
}
