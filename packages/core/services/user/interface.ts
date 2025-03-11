import { Result } from "resulto";
import { User } from "../../entities/user";
import {
  UsernameExistsError,
  UserNotFoundError,
  WrongPasswordError,
} from "./errors";
import { Id } from "../../utils/id";

export type UpdateUserDto = {
  username?: string;
  description?: string | null;
  imageUrl?: string | null;
  password?: {
    old: string;
    new: string;
  };
};

export interface IUserService {
  searchUsers(props: { search: string; limit: number }): Promise<User[]>;

  createUser(props: {
    username: string;
    password: string;
  }): Promise<Result<User, UsernameExistsError>>;

  getUser(id: Id): Promise<User | null>;

  getUserByUsername(username: string): Promise<User | null>;

  validateUsernameAndPassword(props: {
    username: string;
    password: string;
  }): Promise<Result<User, UserNotFoundError | WrongPasswordError>>;

  updateUser(props: {
    id: Id;
    data: UpdateUserDto;
  }): Promise<
    Result<User, UserNotFoundError | UsernameExistsError | WrongPasswordError>
  >;
}
