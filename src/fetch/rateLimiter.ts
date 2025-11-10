import Bottleneck from "bottleneck";

export function buildRateLimiter(concurrency: number) {
return new Bottleneck({
maxConcurrent: Math.max(1, concurrency),
minTime: 80 // ~12.5 rps distributed across concurrency
});
}