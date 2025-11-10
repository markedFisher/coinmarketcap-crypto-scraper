import { Command } from "commander";
import fs from "fs-extra";
import path from "path";
import { createLogger } from "./utils/logger.js";
import { nowIso } from "./utils/time.js";
import { FetchClient } from "./fetch/client.js";
import { buildRateLimiter } from "./fetch/rateLimiter.js";
import { parseAssetList, AssetItem } from "./parsers/assetList.js";
import { buildQuotesForAsset } from "./parsers/quotes.js";
import { normalizeAsset, NormalizedAsset } from "./pipelines/normalizeAsset.js";
import { dedupeAssets } from "./pipelines/dedupe.js";
import { exportJson } from "./exporters/toJson.js";
import { exportNdjson } from "./exporters/toNdjson.js";
import { exportCsv } from "./exporters/toCsv.js";

const log = createLogger();

type Settings = {
outputDir: string;
format: Array<"json" | "ndjson" | "csv">;
pageSize: number;
maxPages: number;
concurrency: number;
retries: number;
};

async function loadSettings(): Promise<Settings> {
const defaultsPath = path.resolve("src/config/settings.example.json");
let settings: Settings = JSON.parse(await fs.readFile(defaultsPath, "utf-8"));
const localPath = path.resolve("src/config/settings.json");
if (await fs.pathExists(localPath)) {
const local = JSON.parse(await fs.readFile(localPath, "utf-8"));
settings = { ...settings, ...local };
}
return settings;
}

async function run() {
const program = new Command();
program
.option("-o, --output <dir>", "Output directory (overrides settings)")
.option("--pages <n>", "Max pages to fetch", (v) => parseInt(v, 10))
.option("--size <n>", "Page size", (v) => parseInt(v, 10))
.option("--format <fmt...>", "One or more of json ndjson csv")
.parse(process.argv);

const cli = program.opts<{ output?: string; pages?: number; size?: number; format?: string[] }>();
const settings = await loadSettings();

if (cli.output) settings.outputDir = cli.output;
if (typeof cli.pages === "number" && !Number.isNaN(cli.pages)) settings.maxPages = cli.pages;
if (typeof cli.size === "number" && !Number.isNaN(cli.size)) settings.pageSize = cli.size;
if (cli.format?.length) settings.format = cli.format as Settings["format"];

const limiter = buildRateLimiter(settings.concurrency);
const client = new FetchClient(limiter, settings.retries);

log.info({ settings }, "Starting CoinMarketCap scrape");

const allAssets: AssetItem[] = [];
for (let page = 1; page <= settings.maxPages; page++) {
const start = (page - 1) * settings.pageSize + 1;
log.info({ page, start }, "Fetching listing page");
try {
const listing = await client.fetchListing({
start,
limit: settings.pageSize,
convert: "USD"
});
const assets = parseAssetList(listing);
if (assets.length === 0) {
log.warn({ page }, "No assets returned; stopping pagination");
break;
}
allAssets.push(...assets);
} catch (err) {
log.error({ err }, "Listing fetch failed; continuing");
break;
}
}

// Map for BTC & ETH USD prices to compute cross-quotes reliably
const btc = allAssets.find((a) => a.symbol === "BTC");
const eth = allAssets.find((a) => a.symbol === "ETH");
const btcUsd = btc?.price ?? 0;
const ethUsd = eth?.price ?? 0;

const normalized: NormalizedAsset[] = [];
for (const asset of allAssets) {
try {
const quotes = buildQuotesForAsset(asset, btcUsd, ethUsd);
const norm = normalizeAsset(asset, quotes);
normalized.push(norm);
} catch (err) {
log.error({ id: asset.id, symbol: asset.symbol, err }, "Normalization failed for asset");
}
}

const deduped = dedupeAssets(normalized);
const stamped = deduped.map((a) => ({ ...a, scrapedAt: nowIso() }));

await fs.ensureDir(settings.outputDir);

if (settings.format.includes("json")) {
const out = path.join(settings.outputDir, `assets-${Date.now()}.json`);
await exportJson(stamped, out);
log.info({ file: out }, "Exported JSON");
}
if (settings.format.includes("ndjson")) {
const out = path.join(settings.outputDir, `assets-${Date.now()}.ndjson`);
await exportNdjson(stamped, out);
log.info({ file: out }, "Exported NDJSON");
}
if (settings.format.includes("csv")) {
const out = path.join(settings.outputDir, `assets-${Date.now()}.csv`);
await exportCsv(stamped, out);
log.info({ file: out }, "Exported CSV");
}

log.info(
{ totalFetched: allAssets.length, totalExported: stamped.length },
"Scrape complete"
);
}

run().catch((err) => {
log.fatal({ err }, "Fatal error");
process.exit(1);
});