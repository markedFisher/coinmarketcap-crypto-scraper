import { describe, it, expect } from "vitest";
import { parseAssetList } from "../src/parsers/assetList.js";

describe("parseAssetList", () => {
it("maps listing response to asset items", () => {
const api = {
data: {
cryptoCurrencyList: [
{
id: 1,
name: "Bitcoin",
symbol: "BTC",
slug: "bitcoin",
cmcRank: 1,
marketPairCount: 1000,
circulatingSupply: 100,
totalSupply: 100,
maxSupply: 210,
ath: 100000,
atl: 0.01,
high24h: 98000,
low24h: 94000,
lastUpdated: "2025-01-01T00:00:00.000Z",
listedAt: 1278979200,
quotes: [
{
price: 95000,
marketCap: 1800000000000,
volume24h: 50000000000,
percentChange1h: 0.1,
percentChange24h: -1.1,
percentChange7d: -8.1
}
]
}
]
}
};
const out = parseAssetList(api);
expect(out.length).toBe(1);
expect(out[0].symbol).toBe("BTC");
expect(out[0].price).toBe(95000);
expect(out[0].cmcRank).toBe(1);
});
});