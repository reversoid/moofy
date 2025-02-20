import { Result, err, ok } from "resulto";
import dayjs from "dayjs";
import { Session } from "../../entities/session";
import { ISessionRepository } from "../../repositories/session.repository";
import { ISessionService } from "./interface";
import { SessionExpiredError, SessionNotFoundError } from "./errors";
import crypto from "node:crypto";
import { User } from "../../entities";

const SESSION_EXPIRATION = { amount: 60, unit: "days" } as const;
const SESSION_EXTENSION_THRESHOLD = { amount: 30, unit: "days" } as const;

export class SessionService implements ISessionService {
  constructor(private readonly sessionRepository: ISessionRepository) {}

  generateSessionToken(): string {
    const alphabet =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const bytes = crypto.randomBytes(64);

    return [...bytes].map((byte) => alphabet[byte % alphabet.length]).join("");
  }

  async createSession(token: string, user: User): Promise<Session> {
    const sessionId = await this.hashToken(token);

    return await this.sessionRepository.create(
      new Session({
        id: sessionId,
        expiresAt: dayjs()
          .add(SESSION_EXPIRATION.amount, SESSION_EXPIRATION.unit)
          .toDate(),
        user,
      })
    );
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

  private async hashToken(token: string): Promise<string> {
    const encoder = new TextEncoder();

    const hashBuffer = await crypto.subtle.digest(
      "SHA-256",
      encoder.encode(token)
    );

    return Buffer.from(hashBuffer).toString("hex");
  }
}
