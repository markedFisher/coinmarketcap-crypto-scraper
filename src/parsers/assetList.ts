import { createLogger } from "../utils/logger.js";
const log = createLogger();

export type AssetItem = {
id: number;
name: string;
symbol: string;
slug: string;
cmcRank: number;
marketPairCount: number;
circulatingSupply: number | null;
selfReportedCirculatingSupply: number | null;
totalSupply: number | null;
maxSupply: number | null;
ath: number | null;
atl: number | null;
high24h: number | null;
low24h: number | null;
isActive: number;
lastUpdated: string | null;
dateAdded: string | null;
price: number | null; // USD price baseline
marketCap: number | null; // USD
volume24h: number | null; // USD
percentChange1h: number | null;
percentChange24h: number | null;
percentChange7d: number | null;
};

export function parseAssetList(apiResponse: any): AssetItem[] {
try {
const list = apiResponse?.data?.cryptoCurrencyList ?? [];
if (!Array.isArray(list)) return [];
const out: AssetItem[] = list.map((row: any) => {
return {
id: row.id,
name: row.name,
symbol: row.symbol,
slug: row.slug,
cmcRank: row.cmcRank,
marketPairCount: row.marketPairCount ?? 0,
circulatingSupply: toNum(row.circulatingSupply),
selfReportedCirculatingSupply: toNum(row.selfReportedCirculatingSupply),
totalSupply: toNum(row.totalSupply),
maxSupply: toNum(row.maxSupply),
ath: toNum(row.ath),
atl: toNum(row.atl),
high24h: toNum(row.high24h),
low24h: toNum(row.low24h),
isActive: 1,
lastUpdated: row.lastUpdated ?? null,
dateAdded: row.listedAt ? new Date(row.listedAt * 1000).toISOString() : row.dateAdded ?? null,
price: toNum(row.quotes?.[0]?.price ?? row.price),
marketCap: toNum(row.quotes?.[0]?.marketCap ?? row.marketCap),
volume24h: toNum(row.quotes?.[0]?.volume24h ?? row.volume24h),
percentChange1h: toNum(row.quotes?.[0]?.percentChange1h ?? row.percentChange1h),
percentChange24h: toNum(row.quotes?.[0]?.percentChange24h ?? row.percentChange24h),
percentChange7d: toNum(row.quotes?.[0]?.percentChange7d ?? row.percentChange7d)
};
});
return out;
} catch (err) {
log.error({ err }, "Failed to parse asset list");
return [];
}
}

function toNum(val: any): number | null {
if (val === null || val === undefined) return null;
const n = Number(val);
return Number.isFinite(n) ? n : null;
}