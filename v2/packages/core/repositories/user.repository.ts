import { User } from "../entities/user";
import { IBaseRepository } from "./base.repository";

export interface IUserRepository extends IBaseRepository<User> {
  searchUsers(search: string): Promise<User[]>;
  getByUsername(username: string): Promise<User | null>;
}
