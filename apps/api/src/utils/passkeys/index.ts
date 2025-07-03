import { db } from "@repo/repositories/db";
import { AuthenticatorTransportFuture } from "@simplewebauthn/server";
import { z } from "zod";

export const transportsSchema = z.array(
  z.enum(["ble", "cable", "hybrid", "internal", "nfc", "smart-card", "usb"])
);

export const deletePasskey = async (passkeyId: string) => {
  await db.deleteFrom("userPasskeys").where("id", "=", passkeyId).execute();
};

export const updatePasskey = async (
  passkeyId: string,
  values: { nickname?: string; counter?: number }
) => {
  const existingPasskeys = await db
    .updateTable("userPasskeys")
    .set({ nickname: values.nickname, counter: values.counter })
    .where("id", "=", passkeyId)
    .returningAll()
    .execute();

  return existingPasskeys;
};

export const getUserPasskeys = async (userId: number) => {
  const existingPasskeys = await db
    .selectFrom("userPasskeys")
    .selectAll()
    .where("userId", "=", userId)
    .orderBy("createdAt asc")
    .execute();

  return existingPasskeys;
};

export const getUserPasskey = async (passkeyId: string) => {
  const existingPasskey = await db
    .selectFrom("userPasskeys")
    .selectAll()
    .where("id", "=", passkeyId)
    .executeTakeFirst();

  return existingPasskey;
};

export const parseTransportsArray = (
  v: string[] | null
): AuthenticatorTransportFuture[] | undefined => {
  return v ? transportsSchema.parse(v) : undefined;
};
