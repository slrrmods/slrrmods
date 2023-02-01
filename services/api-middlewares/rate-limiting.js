import { ValidationError } from "../../classes";
import { ENVIROMENT_URL, IS_DEVELOPMENT_ENV } from "../../utils/constants";
import { getIp } from "../../utils/ip";
import rateLimit from "../rate-limit";

const rateLimiters = {};
const defaultLimitConfiguration = {
	limit: 5,
	interval: 60 * 1000,
	usersPerSecond: 100,
};

export default function applyRateLimit({ request, response, configuration }) {
	if (IS_DEVELOPMENT_ENV) return;

	const limitConfiguration = {
		...defaultLimitConfiguration,
		...configuration.rateLimit,
	};

	const url = new URL(request.url, ENVIROMENT_URL);
	const endPoint = url.pathname;

	if (!rateLimiters[endPoint])
		rateLimiters[endPoint] = rateLimit(limitConfiguration);

	const limiter = rateLimiters[endPoint];
	const token = getIp(request);

	const result = limiter.check(token);
	setHeaders(result, response);

	if (result.isRateLimited) throw new ValidationError("Too many requests", 429);
}

function setHeaders(result, response) {
	const { limit, remaining, resetTime, retryAfter } = result;

	response.setHeader("X-RateLimit-Limit", limit);
	response.setHeader("X-RateLimit-Remaining", remaining);
	response.setHeader("X-RateLimit-Reset", resetTime);

	if (retryAfter) response.setHeader("Retry-After", retryAfter);
}
