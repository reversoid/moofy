import { User } from "../entities/user";
import { IBaseRepository } from "./base.repository";

export abstract class IUserRepository extends IBaseRepository<User> {
  abstract searchUsers(search: string, limit: number): Promise<User[]>;
  abstract getOldestUsers(limit: number): Promise<User[]>;
  abstract getByUsername(username: string): Promise<User | null>;
}
