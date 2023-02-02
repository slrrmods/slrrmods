import validateMethod from "./validate-method";
import applyRateLimit from "./rate-limiting";
import validateHeaders from "./validate-headers";
import validateQuery from "./validate-query";
import validateBody from "./validate-body";
import validateSession from "./validate-session";
import validateUser from "./validate-user";
import validateAuthentication from "./validate-authentication";

const middlewares = [
	validateMethod,
	applyRateLimit,
	validateHeaders,
	validateQuery,
	validateBody,
	validateSession,
	validateUser,
	validateAuthentication,
];

export default async function runMiddlewares(context) {
	for (let i = 0; i < middlewares.length; i++) {
		const middleware = middlewares[i];
		await middleware(context);
	}
}
