import { Result } from "resulto";
import { User } from "../../entities/user";
import {
  UsernameExistsError,
  UserNotFoundError,
  WrongPasswordError,
} from "./errors";
import { Id } from "../../utils/id";

export interface IUserService {
  searchUsers(search: string, limit: number): Promise<User[]>;

  createUser(
    username: string,
    password: string
  ): Promise<Result<User, UsernameExistsError>>;

  getUser(id: Id): Promise<User | null>;

  getUserByUsername(username: string): Promise<User | null>;

  validateUserAndPassword(
    username: string,
    password: string
  ): Promise<Result<User, UserNotFoundError | WrongPasswordError>>;

  updateUser(
    id: Id,
    data: Partial<User>
  ): Promise<Result<User, UserNotFoundError>>;
}
