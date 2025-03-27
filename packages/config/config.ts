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
  ENV: z.enum(["development", "staging", "production"]),

  UNOFFICIAL_KP_API_KEYS: z.string().transform((v) => v.split(",")),
  UNOFFICIAL_KP_URL: z
    .string()
    .default("https://kinopoiskapiunofficial.tech/api"),

  COOKIE_SECRET: z.string(),

  S3_ACCESS_KEY_ID: z.string(),
  S3_SECRET_ACCESS_KEY: z.string(),
  S3_BUCKET_NAME: z.string(),

  REDIS_CONNECTION_STRING: z.string(),

  PG_CONNECTION_STRING: z.string(),
  PG_MAX_CONNECTIONS: z.coerce.number().int().default(10),
} as const;

// TODO can do without obj schema?
const objSchema = z.object(schema);

export default parseEnv(process.env, schema) as z.infer<typeof objSchema>;
