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
    const newUser = User.create({
      username: props.username.toLowerCase(),
      passwordHash,
    });

    const existingUser = await this.getUserByUsername(props.username);
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

  async validateUsernameAndPassword(props: {
    username: string;
    password: string;
  }): Promise<Result<User, UserNotFoundError | WrongPasswordError>> {
    const user = await this.getUserByUsername(props.username);

    if (!user) {
      return err(new UserNotFoundError());
    }

    if (await comparePasswords(props.password, user.passwordHash)) {
      return ok(user);
    }

    return err(new WrongPasswordError());
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const user = await this.userRepository.getByUsername(
      username.toLowerCase()
    );
    return user;
  }

  async updateUser(props: {
    id: Id;
    data: UpdateUserDto;
  }): Promise<Result<User, UserNotFoundError | WrongPasswordError>> {
    const existingUser = await this.userRepository.get(props.id);
    if (!existingUser) {
      return err(new UserNotFoundError());
    }

    const shouldUpdateUsername = props.data.username !== existingUser.username;
    const shouldUpdateDescription =
      props.data.description !== existingUser.description;
    const shouldUpdateImageUrl = props.data.imageUrl !== existingUser.imageUrl;

    if (props.data.username && shouldUpdateUsername) {
      const existingUserWithUsername = await this.getUserByUsername(
        props.data.username
      );
      if (existingUserWithUsername) {
        return err(new UsernameExistsError());
      }
    }

    let newPasswordHash: string | undefined;
    if (props.data.password) {
      const correctOldPassword = await comparePasswords(
        props.data.password.old,
        existingUser.passwordHash
      );

      if (!correctOldPassword) {
        return err(new WrongPasswordError());
      }

      newPasswordHash = await hashPassword(props.data.password.new);
    }

    const updatedUser = await this.userRepository.update(props.id, {
      imageUrl: shouldUpdateImageUrl ? props.data.imageUrl : undefined,
      description: shouldUpdateDescription ? props.data.description : undefined,
      username: shouldUpdateUsername
        ? props.data.username?.toLowerCase()
        : undefined,
      passwordHash: newPasswordHash,
    });

    return ok(updatedUser);
  }
}
