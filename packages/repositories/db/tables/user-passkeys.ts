export interface UserPasskeysTable {
  id: string;
  publicKey: Uint8Array;
  userId: number;
  webauthnUserId: string;
  counter: number;
  deviceType: "singleDevice" | "multiDevice";
  backup: boolean;
  transports: string[] | null;
}
