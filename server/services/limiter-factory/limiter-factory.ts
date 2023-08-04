import { CacheToken, LimiterResult, RateLimitResult } from "@server/services";
import { LRUCache } from "lru-cache";

export function createLimiterCache(
	limit: number,
	interval: number,
	usersPerSecond: number
): RateLimitResult {
	const cache = new LRUCache<string, CacheToken>({
		max: usersPerSecond,
		ttl: interval,
	});

	const check = (token: string): LimiterResult => {
		const tokenInfo = createToken(token, interval, cache);

		const currentUsage = ++tokenInfo.usage;
		const isRateLimited = currentUsage > limit;
		const remaining = Math.max(0, limit - currentUsage);
		const resetTime = tokenInfo.expiresAt;
		const retryAfter = calculateRetryAfter(tokenInfo.expiresAt, isRateLimited);

		return {
			isRateLimited,
			limit,
			remaining,
			resetTime,
			retryAfter,
		};
	};

	return { check };
}

function createToken(
	token: string,
	interval: number,
	cache: LRUCache<string, CacheToken>
) {
	if (!cache.has(token)) {
		cache.set(token, {
			usage: 0,
			expiresAt: Date.now() + interval,
		});
	}

	return cache.get(token)!;
}

function calculateRetryAfter(expiresAt: number, isRateLimited: boolean) {
	if (!isRateLimited) return 0;

	const timeDiff = new Date(expiresAt).getTime() - new Date().getTime();
	return Math.floor(timeDiff / 1000);
}
