import { User } from "../entities/user";
import { IBaseRepository } from "./base.repository";

export abstract class IUserRepository extends IBaseRepository<User> {
  abstract searchUsers(search: string): Promise<User[]>;
  abstract getByUsername(username: string): Promise<User | null>;
}
