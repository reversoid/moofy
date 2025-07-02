import { db } from "@repo/repositories/db";
import { AuthenticatorTransportFuture } from "@simplewebauthn/server";
import { z } from "zod";

export const rpName = "Moofy";

export const rpID = "localhost";

export const origin = `http://localhost:3000`;

export const transportsSchema = z.array(
  z.enum(["ble", "cable", "hybrid", "internal", "nfc", "smart-card", "usb"])
);

export const getUserPasskeys = async (userId: number) => {
  const existingPasskeys = await db
    .selectFrom("userPasskeys")
    .selectAll()
    .where("userId", "=", userId)
    .execute();

  return existingPasskeys.map((p) => ({
    ...p,
    transports: (p.transports ?? undefined) as
      | AuthenticatorTransportFuture[]
      | undefined,
  }));
};

export const getUserPasskey = async (passkeyId: string) => {
  const existingPasskey = await db
    .selectFrom("userPasskeys")
    .selectAll()
    .where("id", "=", passkeyId)
    .executeTakeFirst();

  return existingPasskey
    ? {
        ...existingPasskey,
        transports: parseTransportsArray(existingPasskey.transports),
      }
    : null;
};

export const parseTransportsArray = (
  v: string[] | null
): AuthenticatorTransportFuture[] | undefined => {
  return v ? transportsSchema.parse(v) : undefined;
};
