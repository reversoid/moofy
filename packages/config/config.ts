import { z } from "zod";
import { parseEnv } from "znv";
import dotenv from "dotenv";
import { findWorkspaceDir } from "@pnpm/find-workspace-dir";
import path from "node:path";

const workspaceDir = await findWorkspaceDir(process.cwd());

if (!workspaceDir) {
  throw new Error("No workspace directory found. Something wrong happened.");
}

dotenv.config({ path: path.join(workspaceDir, ".env") });

const schema = {
  API_SIGNATURE_KEY: z.string(),
  API_RP_NAME: z.string().default("Moofy"),
  API_RP_ID: z.string(),
  API_ORIGIN: z.string(),

  ENV: z.enum(["development", "staging", "production"]),

  UNOFFICIAL_KP_API_KEYS: z.string().transform((v) => v.split(",")),
  UNOFFICIAL_KP_URL: z
    .string()
    .default("https://kinopoiskapiunofficial.tech/api"),

  COOKIE_SECRET: z.string(),

  PG_USER: z.string(),
  PG_PASSWORD: z.string(),
  PG_HOST: z.string(),
  PG_PORT: z.coerce.number().int(),
  PG_MAX_CONNECTIONS: z.coerce.number().int().default(10),
  PG_DATABASE: z.string(),

  S3_ACCESS_KEY_ID: z.string(),
  S3_SECRET_ACCESS_KEY: z.string(),
  S3_BUCKET_NAME: z.string(),
} as const;

const _ = z.object(schema);
type Schema = z.infer<typeof _>;

export default parseEnv(process.env, schema) as Schema;
