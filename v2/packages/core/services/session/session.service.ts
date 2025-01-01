import { Result, err, ok } from "resulto";
import dayjs from "dayjs";
import { Session } from "../../entities/session";
import { Id } from "../../utils/id";
import { ISessionRepository } from "../../repositories/session.repository";
import { ISessionService } from "./interface";
import { SessionExpiredError, SessionNotFoundError } from "./errors";
import cuid2 from "@paralleldrive/cuid2";

const SESSION_EXPIRATION = { amount: 60, unit: "days" } as const;
const SESSION_EXTENSION_THRESHOLD = { amount: 30, unit: "days" } as const;

const generateId = cuid2.init({ length: 16 });

export class SessionService implements ISessionService {
  constructor(private readonly sessionRepository: ISessionRepository) {}

  async createSession(userId: Id): Promise<Session> {
    const token = this.generateSessionToken();
    const sessionId = await this.hashToken(token);

    const session = new Session({
      id: sessionId,
      userId,
      expiresAt: dayjs()
        .add(SESSION_EXPIRATION.amount, SESSION_EXPIRATION.unit)
        .toDate(),
    });

    return await this.sessionRepository.create(session);
  }

  async validateSessionToken(
    token: string
  ): Promise<Result<Session, SessionNotFoundError | SessionExpiredError>> {
    const sessionId = await this.hashToken(token);
    const session = await this.sessionRepository.get(sessionId);

    if (!session) {
      return err(new SessionNotFoundError());
    }

    const now = dayjs();
    const expiresAt = dayjs(session.expiresAt);

    if (now.isAfter(expiresAt)) {
      await this.sessionRepository.remove(sessionId);
      return err(new SessionExpiredError());
    }

    const extensionThreshold = expiresAt.subtract(
      SESSION_EXTENSION_THRESHOLD.amount,
      SESSION_EXTENSION_THRESHOLD.unit
    );

    if (now.isAfter(extensionThreshold)) {
      session.expiresAt = now
        .add(SESSION_EXPIRATION.amount, SESSION_EXPIRATION.unit)
        .toDate();
      await this.sessionRepository.update(session.id, {
        expiresAt: session.expiresAt,
      });
    }

    return ok(session);
  }

  async invalidateSession(sessionId: string): Promise<void> {
    await this.sessionRepository.remove(sessionId);
  }

  private generateSessionToken(): string {
    return generateId();
  }

  private async hashToken(token: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(token);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
}
