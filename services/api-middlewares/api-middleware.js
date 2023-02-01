import validateMethod from "./validate-method";
import applyRateLimit from "./rate-limiting";
import validateHeaders from "./validate-headers";
import validateQuery from "./validate-query";
import validateBody from "./validate-body";

const middlewares = [
	validateMethod,
	applyRateLimit,
	validateHeaders,
	validateQuery,
	validateBody,
];

export default async function runMiddlewares(context) {
	for (let i = 0; i < middlewares.length; i++) {
		const middleware = middlewares[i];
		await middleware(context);
	}
}
