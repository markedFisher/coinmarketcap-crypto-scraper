import { AssetItem } from "../parsers/assetList.js";
import { Quote } from "../parsers/quotes.js";

export type NormalizedAsset = {
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
quotes: Quote[];
isAudited: boolean;
auditInfoList: Array<{
auditor: string;
auditStatus: string;
auditTime: string;
reportUrl: string;
}>;
badges: number[];
};

export function normalizeAsset(asset: AssetItem, quotes: Quote[]): NormalizedAsset {
return {
id: asset.id,
name: asset.name,
symbol: asset.symbol,
slug: asset.slug,
cmcRank: asset.cmcRank,
marketPairCount: asset.marketPairCount,
circulatingSupply: asset.circulatingSupply,
selfReportedCirculatingSupply: asset.selfReportedCirculatingSupply,
totalSupply: asset.totalSupply,
maxSupply: asset.maxSupply,
ath: asset.ath,
atl: asset.atl,
high24h: asset.high24h,
low24h: asset.low24h,
isActive: asset.isActive,
lastUpdated: asset.lastUpdated,
dateAdded: asset.dateAdded,
quotes,
isAudited: false,
auditInfoList: [],
badges: [1]
};
}