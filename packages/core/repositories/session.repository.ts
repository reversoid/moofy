import { Session } from "../entities/session";
import { IBaseRepository } from "./base.repository";

export abstract class ISessionRepository extends IBaseRepository<Session> {}
