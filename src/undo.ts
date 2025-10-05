import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { logAction, getLatestRunLog, getNextRunLog } from "./logger.js";

export async function undoLastAction() {
  const LOG_DIR = path.resolve("logs");
  const usedRunLogs: string[] = [];

  async function doUndo(runLogPath: string|null) {
    if (!runLogPath) {
      console.log(chalk.yellow("No run logs available to undo."));
      return;
    }

    const data = JSON.parse(await fs.readFile(runLogPath, "utf-8"));

    for (const entry of data.reverse()) {
      if (await fs.pathExists(entry.newPath)) {
        const stat = await fs.stat(entry.newPath);
        if (stat.isDirectory()) {
          await fs.move(entry.newPath, entry.oldPath, { overwrite: true });
          console.log(chalk.green(`[UNDO FOLDER] ${path.basename(entry.newPath)}`));
        } else {
          await fs.move(entry.newPath, entry.oldPath, { overwrite: true });
          console.log(chalk.green(`[UNDO FILE] ${path.basename(entry.newPath)}`));
        }
      }
    }

    const undoLogPath = await logAction(data, "undo", false);
    console.log(chalk.cyan(`✅ Undo complete. Log saved as ${path.basename(undoLogPath)}`));
    usedRunLogs.push(path.basename(runLogPath));
  }

  // pick latest run log not yet undone
  let runLog = await getNextRunLog(usedRunLogs);
  if (!runLog) runLog = await getLatestRunLog();

  await doUndo(runLog);
}
