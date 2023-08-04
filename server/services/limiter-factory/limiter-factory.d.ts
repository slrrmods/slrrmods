export type CacheToken = {
	usage: number;
	expiresAt: number;
};

export type LimiterResult = {
	isRateLimited: boolean;
	limit: number;
	remaining: number;
	resetTime: number;
	retryAfter: number;
};

export type RateLimitResult = {
	check: (token: string) => LimiterResult;
};
