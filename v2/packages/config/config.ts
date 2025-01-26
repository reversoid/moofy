import { z } from "zod";
import { parseEnv } from "znv";
import dotenv from "dotenv";
import { findWorkspaceDir } from "@pnpm/find-workspace-dir";
import path from "path";

const workspaceDir = await findWorkspaceDir(process.cwd());

if (!workspaceDir) {
  throw new Error("No workspace directory found. Something wrong happened.");
}

dotenv.config({ path: path.join(workspaceDir, ".env") });

const schema = {
  UNOFFICIAL_KP_API_KEYS: z.string().transform((v) => v.split(",")),
  UNOFFICIAL_KP_URL: z.string(),
  PG_USER: z.string(),
  PG_PASSWORD: z.string(),
  PG_HOST: z.string(),
  PG_PORT: z.coerce.number().int(),
  PG_MAX_CONNECTIONS: z.coerce.number().int(),
  PG_DATABASE: z.string(),
  COOKIE_SECRET: z.string(),
  ENV: z.enum(["development", "test", "production"]),
};

export default parseEnv(process.env, schema);
