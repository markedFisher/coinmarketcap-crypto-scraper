import { AssetItem } from "./assetList.js";

export type Quote = {
name: "USD" | "BTC" | "ETH";
price: number;
volume24h: number | null;
volume7d: number | null;
volume30d: number | null;
marketCap: number | null;
selfReportedMarketCap: number | null;
percentChange1h: number | null;
percentChange24h: number | null;
percentChange7d: number | null;
percentChange30d: number | null;
percentChange60d: number | null;
percentChange90d: number | null;
fullyDilluttedMarketCap: number | null;
marketCapByTotalSupply: number | null;
dominance: number | null;
turnover: number | null;
ytdPriceChangePercentage: number | null;
percentChange1y: number | null;
lastUpdated: string | null;
};

export function buildQuotesForAsset(
asset: AssetItem,
btcUsd: number,
ethUsd: number
): Quote[] {
const usdPrice = asset.price ?? 0;

const toQuote = (name: "USD" | "BTC" | "ETH", denom: number) => {
const price = denom > 0 ? usdPrice / denom : usdPrice;
const mc = asset.marketCap != null ? asset.marketCap / (denom || 1) : null;
return {
name,
price,
volume24h: asset.volume24h != null ? asset.volume24h / (denom || 1) : null,
volume7d: null,
volume30d: null,
marketCap: mc,
selfReportedMarketCap: null,
percentChange1h: asset.percentChange1h,
percentChange24h: asset.percentChange24h,
percentChange7d: asset.percentChange7d,
percentChange30d: null,
percentChange60d: null,
percentChange90d: null,
fullyDilluttedMarketCap: null,
marketCapByTotalSupply: mc,
dominance: null,
turnover: null,
ytdPriceChangePercentage: null,
percentChange1y: null,
lastUpdated: asset.lastUpdated
} as Quote;
};

const quotes: Quote[] = [toQuote("USD", 1)];
quotes.push(toQuote("BTC", btcUsd || 1));
quotes.push(toQuote("ETH", ethUsd || 1));

return quotes;
}