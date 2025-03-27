import { Session } from "@repo/core/entities";
import { ISessionRepository } from "@repo/core/repositories";
import { db } from "../db/pg";
import { SessionSelects, UserSelects } from "./utils/selects";
import { makeSession } from "./utils/make-entity";

export class SessionRepository extends ISessionRepository {
  async create(data: Session): Promise<Session> {
    const { id } = await db
      .insertInto("sessions")
      .values({
        expiresAt: data.expiresAt,
        userId: data.user.id.value,
        id: data.id,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return this.getOrThrow(id);
  }

  async get(id: string): Promise<Session | null> {
    const session = await db
      .selectFrom("sessions")
      .innerJoin("users", "users.id", "sessions.userId")
      .select(UserSelects.userSelects)
      .select(SessionSelects.sessionSelects)
      .where("sessions.id", "=", id)
      .executeTakeFirst();

    if (!session) {
      return null;
    }

    return makeSession(session);
  }

  async update(id: string, data: Partial<Session>): Promise<Session> {
    if (Object.values(data).every((v) => v === undefined)) {
      return this.getOrThrow(id);
    }

    await db
      .updateTable("sessions")
      .set({ expiresAt: data.expiresAt, userId: data.user?.id.value })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirstOrThrow();

    return this.getOrThrow(id);
  }

  async remove(id: string): Promise<void> {
    await db.deleteFrom("sessions").where("id", "=", id).execute();
  }
}
