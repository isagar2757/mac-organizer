#!/usr/bin/env node
import { Command } from "commander";
import { organize } from "./organizer.js";
import { undoLastAction } from "./undo.js";
import chalk from "chalk";

const program = new Command();

program
  .name("mac-organizer")
  .description("Organize and clean your Mac folders")
  .version("1.0.0");

program
  .command("run")
  .description("Organize files in a folder")
  .option("-p, --path <path>", "Folder path to organize", ".")
  .option("--dry-run", "Show what will happen without moving files")
  .action(async (opts) => {
    await organize(opts.path, opts.dryRun);
  });

program
  .command("undo")
  .description("Undo the last organization action")
  .action(async () => {
    await undoLastAction();
  });

program.parse(process.argv);
