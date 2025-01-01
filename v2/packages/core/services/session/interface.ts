import { Result } from "resulto";
import { Session } from "../../entities/session";
import { User } from "../../entities/user";
import { Id } from "../../utils/id";
import { SessionExpiredError, SessionNotFoundError } from "./errors";

export interface ISessionService {
  createSession(userId: Id): Promise<Session>;

  validateSessionToken(
    token: string
  ): Promise<Result<Session, SessionExpiredError | SessionNotFoundError>>;

  invalidateSession(sessionId: string): Promise<void>;
}
