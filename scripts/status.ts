# Run this once. It reads your .env, tells you which services are ready,
# and which keys you still need to drop in. It also gives you the exact
# signup URL for each missing service.

import "dotenv/config";
import chalk from "chalk";
import { status, readyOnly, missingOnly } from "./lib/clients.js";

console.log(chalk.bold("\n  JUST MONEY — Service Status\n"));

const all = status();
const ready = all.filter((s) => s.ready);
const missing = all.filter((s) => !s.ready);

console.log(chalk.green(`  ✓ ${ready.length} services ready:`), ready.map((s) => s.name).join(", ") || chalk.dim("(none yet)"));
console.log();

if (missing.length) {
  console.log(chalk.yellow(`  ✗ ${missing.length} services need keys:\n`));
  for (const s of missing) {
    console.log(chalk.bold(`    ${s.name}`), chalk.dim("— needs: " + s.missing.join(", ")));
    console.log(chalk.dim(`    → ${s.hint}\n`));
  }
}

console.log(chalk.dim("  Drop keys into .env, then re-run: node --import tsx scripts/status.ts\n"));

const suggestions: string[] = [];
if (missing.some((s) => s.name === "openai")) suggestions.push("Start here: get OPENAI_API_KEY (5 min) — unlocks cover images");
if (missing.some((s) => s.name === "etsy")) suggestions.push("Open Etsy shop first (30 min), then API key comes later (1-3 day approval)");
if (missing.some((s) => s.name === "gumroad")) suggestions.push("Gumroad token takes 5 min — fastest marketplace to list on");
if (missing.some((s) => s.name === "supabase")) suggestions.push("Supabase unlocks the admin dashboard — 10 min to set up");
if (missing.some((s) => s.name === "vercel")) suggestions.push("Vercel token is 2 min — deploy admin to a live URL");

if (suggestions.length) {
  console.log(chalk.cyan("  Suggested order:\n"));
  for (const s of suggestions) console.log(chalk.cyan("   →"), s);
  console.log();
}
