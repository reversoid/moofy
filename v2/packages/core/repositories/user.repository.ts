import { User } from "../entities/user";
import { IBaseRepository } from "./base.repository";

export interface UserRepository extends IBaseRepository<User> {}
