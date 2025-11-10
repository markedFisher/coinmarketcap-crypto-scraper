import axios, { AxiosInstance } from "axios";
import { CMC_LISTING_ENDPOINT } from "../config/constants.js";
import { createLogger } from "../utils/logger.js";
import type Bottleneck from "bottleneck";

const log = createLogger();

export type ListingRequest = {
start: number;
limit: number;
convert: "USD";
};

export class FetchClient {
private http: AxiosInstance;
private limiter: Bottleneck;
private retries: number;

constructor(limiter: Bottleneck, retries = 3) {
this.http = axios.create({
timeout: 15000,
headers: {
"User-Agent":
"Mozilla/5.0 (compatible; Bitbash-CMC-Scraper/1.0; +https://bitbash.dev)"
}
});
this.limiter = limiter;
this.retries = retries;
}

async fetchListing(req: ListingRequest): Promise<any> {
const params = {
start: req.start,
limit: req.limit,
convert: req.convert,
// Add typical query params used by CMC's web app to improve compatibility
sortBy: "market_cap",
sortType: "desc",
cryptoType: "all",
tagType: "all",
aux: "cmc_rank,market_cap,price,volume_24h,percent_change_1h,percent_change_24h,percent_change_7d,max_supply,circulating_supply,total_supply,ath,atl,high24h,low24h,last_updated,date_added,self_reported_circulating_supply,market_pair_count"
};

return this.withRetries(async () => {
return this.limiter.schedule(async () => {
const res = await this.http.get(CMC_LISTING_ENDPOINT, { params });
if (!res.data) throw new Error("Empty response body");
return res.data;
});
});
}

private async withRetries<T>(fn: () => Promise<T>, attempt = 1): Promise<T> {
try {
return await fn();
} catch (err: any) {
if (attempt <= this.retries) {
const delayMs = 500 * attempt ** 2;
log.warn({ attempt, delayMs, err: err?.message }, "Retrying after error");
await new Promise((r) => setTimeout(r, delayMs));
return this.withRetries(fn, attempt + 1);
}
log.error({ err }, "Max retries exceeded");
throw err;
}
}
}