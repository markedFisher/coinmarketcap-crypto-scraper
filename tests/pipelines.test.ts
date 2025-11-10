import { describe, it, expect } from "vitest";
import { buildQuotesForAsset } from "../src/parsers/quotes.js";
import { normalizeAsset } from "../src/pipelines/normalizeAsset.js";

describe("pipelines", () => {
it("builds USD/BTC/ETH quotes from baseline USD price", () => {
const asset = {
id: 2,
name: "Ether",
symbol: "ETH",
slug: "ethereum",
cmcRank: 2,
marketPairCount: 800,
circulatingSupply: 100,
selfReportedCirculatingSupply: null,
totalSupply: 100,
maxSupply: null,
ath: 6000,
atl: 0.1,
high24h: 4000,
low24h: 3800,
isActive: 1,
lastUpdated: "2025-01-01T00:00:00.000Z",
dateAdded: "2015-07-30T00:00:00.000Z",
price: 4000,
marketCap: 1000000,
volume24h: 1000,
percentChange1h: 0.2,
percentChange24h: 1.1,
percentChange7d: 5.5
};

const quotes = buildQuotesForAsset(asset as any, 100000, 4000);
const norm = normalizeAsset(asset as any, quotes);

const qUSD = norm.quotes.find((q) => q.name === "USD")!;
const qBTC = norm.quotes.find((q) => q.name === "BTC")!;
const qETH = norm.quotes.find((q) => q.name === "ETH")!;

expect(qUSD.price).toBeCloseTo(4000, 6);
expect(qBTC.price).toBeCloseTo(0.04, 6);
expect(qETH.price).toBeCloseTo(1, 6);
expect(norm.symbol).toBe("ETH");
});
});

coinmarketcap-crypto-scraper/LICENSE
textMIT License

Copyright (c) 2025 Bitbash

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.