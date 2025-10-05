import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

const LOG_DIR = path.resolve("logs");

export async function undoLastAction() {
  const logs = await fs.readdir(LOG_DIR);
  if (logs.length === 0) {
    console.log(chalk.yellow("No logs found to undo."));
    return;
  }

  const lastLog = path.join(LOG_DIR, logs.sort().reverse()[0]);
  const data = JSON.parse(await fs.readFile(lastLog, "utf-8"));

  for (const entry of data.reverse()) {
    const exists = await fs.pathExists(entry.newPath);
    if (!exists) continue;

    // If newPath is a folder, move the entire folder back
    const stat = await fs.stat(entry.newPath);
    if (stat.isDirectory()) {
      await fs.move(entry.newPath, entry.oldPath, { overwrite: true });
      console.log(chalk.green(`[UNDO FOLDER] ${path.basename(entry.newPath)}`));
    } else {
      // File move
      await fs.move(entry.newPath, entry.oldPath, { overwrite: true });
      console.log(chalk.green(`[UNDO FILE] ${path.basename(entry.newPath)}`));
    }
  }

  console.log(chalk.cyan(`✅ Undo complete for log ${path.basename(lastLog)}`));
}
