import { Generated } from "kysely";

export interface UserPasskeysTable {
  nickname: string;
  id: string;
  publicKey: Uint8Array;
  userId: number;
  webauthnUserId: string;
  counter: number;
  deviceType: "singleDevice" | "multiDevice";
  backup: boolean;
  transports: string[] | null;
  createdAt: Generated<Date>;
}
