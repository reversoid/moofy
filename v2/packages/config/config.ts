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

export default parseEnv(process.env, {
  UNOFFICIAL_KP_API_KEYS: z.array(z.string()),
  UNOFFICIAL_KP_URL: z.string(),

  PG_USER: z.string(),
  PG_PASSWORD: z.string(),
  PG_HOST: z.string(),
  PG_PORT: z.number().int(),
  PG_DB: z.string(),
  PG_MAX_CONNECTIONS: z.number().int(),

  COOKIE_SECRET: z.string(),
});
