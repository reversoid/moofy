import { Result } from "resulto";
import { Session } from "../../entities/session";
import { User } from "../../entities/user";
import { SessionExpiredError, SessionNotFoundError } from "./errors";

export interface ISessionService {
  createSession(token: string, user: User): Promise<Session>;

  generateSessionToken(): string;

  validateAndExtendSession(
    token: string
  ): Promise<Result<Session, SessionExpiredError | SessionNotFoundError>>;

  invalidateSession(sessionId: string): Promise<void>;
}
