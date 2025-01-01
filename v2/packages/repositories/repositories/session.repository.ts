import { Session } from "@repo/core/entities";
import { ISessionRepository } from "@repo/core/repositories";
import { Id } from "@repo/core/utils";
import { db } from "../db";

export class SessionRepository extends ISessionRepository {
  async create(data: Session): Promise<Session> {
    const newSession = await db
      .insertInto("sessions")
      .values({
        expiresAt: data.expiresAt,
        userId: data.userId.value,
        id: data.id,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Session({
      expiresAt: newSession.expiresAt,
      id: newSession.id,
      userId: new Id(newSession.userId),
    });
  }

  async get(id: string): Promise<Session | null> {
    const session = await db
      .selectFrom("sessions")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    if (!session) {
      return null;
    }

    return new Session({
      expiresAt: session.expiresAt,
      id: session.id,
      userId: new Id(session.userId),
    });
  }

  async update(id: string, data: Partial<Session>): Promise<Session> {
    const updatedSession = await db
      .updateTable("sessions")
      .set({ expiresAt: data.expiresAt, userId: data.userId?.value })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Session({
      expiresAt: updatedSession.expiresAt,
      id: updatedSession.id,
      userId: new Id(updatedSession.userId),
    });
  }

  async remove(id: string): Promise<void> {
    await db.deleteFrom("sessions").where("id", "=", id).execute();
  }
}
