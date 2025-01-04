import { Result } from "resulto";
import { User } from "../../entities/user";
import { UsernameExistsError } from "./errors";
import { Id } from "../../utils/id";

export interface IUserService {
  searchUsers(search: string, limit: number): Promise<User[]>;

  createUser(
    username: string,
    password: string
  ): Promise<Result<User, UsernameExistsError>>;

  getUser(id: Id): Promise<User | null>;
}
