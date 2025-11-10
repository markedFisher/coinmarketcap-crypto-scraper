import { NormalizedAsset } from "./normalizeAsset.js";

export function dedupeAssets(items: NormalizedAsset[]): NormalizedAsset[] {
const byId = new Map<number, NormalizedAsset>();
for (const it of items) {
const prev = byId.get(it.id);
if (!prev) {
byId.set(it.id, it);
continue;
}
const prevTime = prev.lastUpdated ? Date.parse(prev.lastUpdated) : 0;
const curTime = it.lastUpdated ? Date.parse(it.lastUpdated) : 0;
if (curTime >= prevTime) byId.set(it.id, it);
}
return Array.from(byId.values()).sort((a, b) => a.cmcRank - b.cmcRank);
}