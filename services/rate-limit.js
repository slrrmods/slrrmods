import LRU from "lru-cache";

export default function rateLimit({ limit, interval, usersPerSecond }) {
	const cache = new LRU({
		max: usersPerSecond,
		ttl: interval,
	});

	const check = (token) => {
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
		const retryAfter = isRateLimited
			? calculateRetryAfter(tokenInfo.expiresAt)
			: undefined;

		return {
			isRateLimited,
			limit,
			remaining,
			resetTime,
			retryAfter,
		};
	};

	return {
		check,
	};
}

function calculateRetryAfter(expiresAt) {
	const timeDiff = new Date(expiresAt).getTime() - new Date().getTime();
	return Math.floor(timeDiff / 1000);
}
