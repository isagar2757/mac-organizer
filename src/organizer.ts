import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { logAction } from "./logger.js";

const configPath = path.join(new URL('.', import.meta.url).pathname, "config.json");
const config = await fs.readJSON(configPath);

function formatDate(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_${pad(date.getHours())}${pad(date.getMinutes())}`;
}

function getCategory(fileName: string, ext: string) {
  return Object.entries(config.rules).find(([_, exts]) =>
    (exts as string[]).includes(ext)
  )?.[0] || config.default;
}

export async function organize(folderPath: string, dryRun = false) {
  const absPath = path.resolve(folderPath);
  const logEntries: any[] = [];
  const protectedExtensions = [".app", ".pkg", ".bundle"]; // macOS protected folders

  async function processFolder(currentPath: string) {
    const items = await fs.readdir(currentPath);
    if (items.length === 0) return;

    const files: string[] = [];
    const dirs: string[] = [];

    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = await fs.stat(fullPath);
      if (stat.isDirectory()) dirs.push(fullPath);
      else files.push(fullPath);
    }

    // Recursively process subdirectories
    for (const dir of dirs) {
      if (protectedExtensions.some(ext => dir.endsWith(ext))) {
        console.log(chalk.yellow(`[SKIP SYSTEM DIR] ${path.basename(dir)}`));
        continue;
      }
      await processFolder(dir);
    }

    if (files.length === 0) return;

    const categories = new Set<string>();
    const fileMap: Record<string, string> = {};
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      const category = getCategory(path.basename(file), ext);
      categories.add(category);
      fileMap[file] = category;
    }

    if (categories.size === 1) {
      // Single-type folder
      const category = Array.from(categories)[0];
      const parentDir = path.dirname(currentPath);
      const parentFolderName = path.basename(parentDir);

      // Skip moving if already in a folder matching the category
      if (path.basename(currentPath).toLowerCase() !== category.toLowerCase() &&
          parentFolderName.toLowerCase() !== category.toLowerCase()) {
        const targetParentDir = path.join(parentDir, category);
        await fs.ensureDir(targetParentDir);
        const folderName = path.basename(currentPath);
        const targetFolder = path.join(targetParentDir, folderName);
        if (!dryRun) await fs.move(currentPath, targetFolder, { overwrite: true });
        console.log(chalk.green(`[MOVE FOLDER] ${folderName} → ${category}/`));
        logEntries.push({ oldPath: currentPath, newPath: targetFolder, time: new Date().toISOString() });
      }
    } else {
      // Mixed-type folder → create category subfolders inside
      for (const file of files) {
        const category = fileMap[file];
        let targetDir = path.join(currentPath, category);

        // Prevent folder into subfolder of itself
        if (path.basename(currentPath).toLowerCase() === category.toLowerCase()) {
          targetDir = currentPath;
        }

        await fs.ensureDir(targetDir);
        const targetPath = path.join(targetDir, path.basename(file));

        if (await fs.pathExists(targetPath)) {
          const stat = await fs.stat(file);
          const targetStat = await fs.stat(targetPath);

          if (stat.mtime > targetStat.mtime) {
            const oldDate = formatDate(targetStat.mtime);
            const renamed = path.join(targetDir, `${path.basename(file, path.extname(file))}_${oldDate}${path.extname(file)}`);
            if (!dryRun) await fs.move(targetPath, renamed, { overwrite: true });
            if (!dryRun) await fs.move(file, targetPath, { overwrite: true });
            console.log(chalk.green(`[MOVE NEW] ${path.basename(file)} → ${category}/`));
          } else {
            const newDate = formatDate((await fs.stat(file)).mtime);
            const renamedNew = path.join(targetDir, `${path.basename(file, path.extname(file))}_${newDate}${path.extname(file)}`);
            if (!dryRun) await fs.move(file, renamedNew, { overwrite: true });
            console.log(chalk.yellow(`[RENAME NEW] ${path.basename(file)} → ${path.basename(renamedNew)}`));
          }
        } else {
          if (!dryRun) await fs.move(file, targetPath, { overwrite: true });
          console.log(chalk.green(`[MOVE] ${path.basename(file)} → ${category}/`));
        }
      }
    }
  }

  await processFolder(absPath);

  if (logEntries.length) {
    const logFile = await logAction(logEntries, "run", dryRun);
    console.log(chalk.cyan(`\n✅ Done! Logged ${logEntries.length} actions to ${path.basename(logFile)}`));
  }
}