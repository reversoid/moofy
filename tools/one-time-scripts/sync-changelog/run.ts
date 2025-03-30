import { db } from "@repo/repositories/db";
import {
  ChangelogRepository,
  ChangelogViewRepository,
  UserRepository,
} from "@repo/repositories";
import { ChangelogService } from "@repo/core/services";
import fs from "node:fs";
import path from "node:path";
import { findWorkspaceDir } from "@pnpm/find-workspace-dir";

const workspaceDir = await findWorkspaceDir(process.cwd());

if (!workspaceDir) {
  throw new Error("No workspace directory found. Something wrong happened.");
}

const uRepo = new UserRepository();
const clvRepo = new ChangelogViewRepository();
const clRepo = new ChangelogRepository();

const changelogService = new ChangelogService(clRepo, clvRepo, uRepo);

const syncChangelog = async () => {
  const changelogPath = path.resolve(workspaceDir, "CHANGELOG.md");
  const changelogContent = fs.readFileSync(changelogPath, "utf-8");

  const [savedChangelogs, allChangelogs] = await Promise.all([
    changelogService.getChangelogs(),
    changelogService.parseChangelogs(changelogContent),
  ]);

  const latestSavedChangelog = savedChangelogs.at(0);

  if (!latestSavedChangelog) {
    for (const changelog of allChangelogs) {
      await changelogService.create(changelog);
    }
    return;
  }

  const changelogsToSave = allChangelogs.filter(
    (cl) => cl.version > latestSavedChangelog.version
  );

  for (const changelog of changelogsToSave) {
    await changelogService.create(changelog);
  }
};

await syncChangelog();
