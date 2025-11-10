import fs from "fs-extra";
import { format } from "@fast-csv/format";
import { NormalizedAsset } from "../pipelines/normalizeAsset.js";

export async function exportCsv(rows: NormalizedAsset[], file: string) {
const stream = format({ headers: true });
const out = fs.createWriteStream(file, "utf-8");
stream.pipe(out);

for (const a of rows) {
const usd = a.quotes.find((q) => q.name === "USD");
stream.write({
id: a.id,
name: a.name,
symbol: a.symbol,
slug: a.slug,
cmcRank: a.cmcRank,
marketPairCount: a.marketPairCount,
circulatingSupply: a.circulatingSupply ?? "",
totalSupply: a.totalSupply ?? "",
maxSupply: a.maxSupply ?? "",
price_usd: usd?.price ?? "",
marketCap_usd: usd?.marketCap ?? "",
volume24h_usd: usd?.volume24h ?? "",
percentChange24h: usd?.percentChange24h ?? "",
lastUpdated: a.lastUpdated ?? ""
});
}

stream.end();

await new Promise<void>((resolve, reject) => {
out.on("finish", () => resolve());
out.on("error", reject);
});
}