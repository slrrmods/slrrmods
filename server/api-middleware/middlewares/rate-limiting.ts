import { ENV_URL, IS_DEV_ENV } from "@common/utils";
import { HandlerContext, RateLimiting } from "@server/api-handler";
import { MiddlewareError } from "@server/classes";
import {
	LimiterResult,
	RateLimitResult,
	createLimiterCache,
	getIp,
} from "@server/services";
import { NextApiResponse } from "next";

const rateLimiters = new Map<string, RateLimitResult>();
const defaultConfiguration = {
	limit: 5,
	interval: 60 * 1000,
	usersPerSecond: 100,
};

export async function applyRateLimiting({
	request,
	response,
	methodConfiguration,
}: HandlerContext) {
	if (IS_DEV_ENV) return;

	const endPoint = getEndpoint(request.url!);
	const limiter = createLimiter(endPoint, methodConfiguration.rateLimiting);
	const ip = getIp(request);
	const result = limiter.check(ip);
	setHeaders(response, result);

	if (result.isRateLimited) throw new MiddlewareError(429, "Too Many Requests");
}

function getEndpoint(url: string) {
	return new URL(url, ENV_URL).pathname;
}

function createLimiter(endPoint: string, configuration?: RateLimiting) {
	const { interval, limit, usersPerSecond } = {
		...defaultConfiguration,
		...configuration,
	};

	if (!rateLimiters.has(endPoint)) {
		const limiter = createLimiterCache(limit, interval, usersPerSecond);
		rateLimiters.set(endPoint, limiter);
	}

	return rateLimiters.get(endPoint)!;
}

function setHeaders(response: NextApiResponse, result: LimiterResult) {
	const { limit, remaining, resetTime, retryAfter } = result;

	response.setHeader("X-RateLimit-Limit", limit);
	response.setHeader("X-RateLimit-Remaining", remaining);
	response.setHeader("X-RateLimit-Reset", resetTime);

	if (retryAfter > 0) response.setHeader("Retry-After", retryAfter);
}
