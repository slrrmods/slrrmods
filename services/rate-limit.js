import LRU from "lru-cache";

export default function rateLimit(limit, interval, usersPerSecond) {
	const cache = new LRU({
		max: usersPerSecond,
		ttl: interval,
	});

	const check = (token, res) => {
		if (!cache.has(token)) {
			cache.set(token, {
				usage: 0,
				expiresAt: Date.now() + interval,
			});
		}

		const tokenInfo = cache.get(token);
		tokenInfo.usage += 1;

		const currentUsage = tokenInfo.usage;
		const isRateLimited = currentUsage > limit;
		const remaining = Math.max(0, limit - currentUsage);
		const resetTime = tokenInfo.expiresAt;

		res.setHeader("X-RateLimit-Limit", limit);
		res.setHeader("X-RateLimit-Remaining", remaining);
		res.setHeader("X-RateLimit-Reset", resetTime);

		if (isRateLimited) {
			const retryAt = Math.floor(
				(new Date(tokenInfo.expiresAt).getTime() - new Date().getTime()) / 1000
			);
			res.setHeader("Retry-After", retryAt);
			throw new Error("Rate limit exceeded");
		}
	};

	return {
		check,
	};
}
