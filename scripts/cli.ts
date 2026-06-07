// =============================================================================
// JUST MONEY — Master CLI
// =============================================================================
// One entry point for the whole empire. Drop your API keys into .env, then run:
//   npm run ship           — full pipeline: generate → list → deploy
//   npm run produce        — mass-produce more products
//   npm run list           — show all products + listing status
//   npm run stats          — show revenue + reviews + remaining work
//   npm run ship           — one command, full deployment
// =============================================================================

import "dotenv/config";
import chalk from "chalk";
import ora from "ora";

const HELP = `
${chalk.bold("JUST MONEY — Empire CLI")}

${chalk.dim("Commands:")}
  ship          Full pipeline (images → package → list on all marketplaces)
  produce       Mass-produce the next batch of products
  list          Show all products + their listing status
  stats         Revenue, reviews, conversion, what's next
  generate      Re-generate covers/mockups for a product
  deploy        Deploy admin dashboard to Vercel

${chalk.dim("Single-purpose:")}
  images:generate     Generate all cover images via DALL-E
  notion:build        Build real Notion template
  sheets:build        Build real Google Sheets
  package             Zip each product for marketplace upload
  etsy:list           Push listings to Etsy
  gumroad:list        Push listings to Gumroad
  stripe:create       Create Stripe products + checkout links
  setup:supabase      Apply schema to Supabase
  setup:webhooks      Wire sale webhooks
  pin:pinterest       Pin to Pinterest
  post:x              Post to X

${chalk.dim("Setup:")}
  cp .env.example .env
  ${chalk.yellow("Then drop API keys in as you get them.")}
`;

async function main() {
  const cmd = process.argv[2];

  if (!cmd || cmd === "help" || cmd === "--help" || cmd === "-h") {
    console.log(HELP);
    return;
  }

  const spinner = ora(chalk.cyan(`Running: ${cmd}`)).start();

  try {
    switch (cmd) {
      case "ship": {
        const { shipAll } = await import("./commands/ship.ts");
        await shipAll(spinner);
        break;
      }
      case "produce": {
        const { produce } = await import("./commands/produce.ts");
        await produce(spinner);
        break;
      }
      case "list": {
        const { listProducts } = await import("./commands/list.ts");
        await listProducts(spinner);
        break;
      }
      case "stats": {
        const { stats } = await import("./commands/stats.ts");
        await stats(spinner);
        break;
      }
      case "generate": {
        const slug = process.argv[3];
        if (!slug) throw new Error("Usage: npm run generate <product-slug>");
        const { generate } = await import("./commands/generate.ts");
        await generate(slug, spinner);
        break;
      }
      case "deploy": {
        const { deploy } = await import("./commands/deploy.ts");
        await deploy(spinner);
        break;
      }
      default:
        spinner.fail(chalk.red(`Unknown command: ${cmd}`));
        console.log(HELP);
        process.exit(1);
    }
  } catch (err) {
    spinner.fail(chalk.red(err instanceof Error ? err.message : String(err)));
    if (process.env.DEBUG) console.error(err);
    process.exit(1);
  }
}

main();
