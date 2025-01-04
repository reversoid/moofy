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

  getUserByUsername(username: string): Promise<User | null>;

  /**
   * Validate user and password and return the user if the password is correct
   * @param username
   * @param password
   * @returns User or null if the user does not exist or the password is incorrect
   */
  validateUserAndPassword(
    username: string,
    password: string
  ): Promise<User | null>;
}
