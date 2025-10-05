import fs from "fs-extra";
import path from "path";

const LOG_DIR = path.resolve("logs"); // logs/ outside src
await fs.ensureDir(LOG_DIR);

export async function logAction(actions: any[], actionName = "run", dryRun = false) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const type = dryRun ? "dry" : "real";
  const fileName = `${actionName}-${type}-${timestamp}.json`;
  const filePath = path.join(LOG_DIR, fileName);
  await fs.writeJSON(filePath, actions, { spaces: 2 });
  return filePath;
}

export async function getLatestRunLog() {
  const files = await fs.readdir(LOG_DIR);
  const runLogs = files.filter(f => f.startsWith("run-") && f.endsWith(".json")).sort().reverse();
  return runLogs.length ? path.join(LOG_DIR, runLogs[0]) : null;
}

export async function getNextRunLog(excludeLogs: string[]) {
  const files = await fs.readdir(LOG_DIR);
  const runLogs = files.filter(f => f.startsWith("run-") && f.endsWith(".json") && !excludeLogs.includes(f)).sort().reverse();
  return runLogs.length ? path.join(LOG_DIR, runLogs[0]) : null;
}
