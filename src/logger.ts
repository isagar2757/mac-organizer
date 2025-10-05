import fs from "fs-extra";
import path from "path";

const LOG_DIR = path.resolve("logs");

export async function logAction(entries: any[]) {
  await fs.ensureDir(LOG_DIR);
  const file = path.join(LOG_DIR, `actions_${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  await fs.writeJson(file, entries, { spaces: 2 });
}
