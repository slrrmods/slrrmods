import applyRateLimit from "./rate-limiting";
import validateAuthentication from "./validate-authentication";
import validateBody from "./validate-body";
import validateHeaders from "./validate-headers";
import validateMethod from "./validate-method";
import validateQuery from "./validate-query";
import validateSession from "./validate-session";
import validateUser from "./validate-user";

const middlewares = [
	validateMethod,
	applyRateLimit,
	validateHeaders,
	validateQuery,
	validateBody,
	validateSession,
	validateUser,
	validateAuthentication
];

export default async function runMiddlewares(context) {
	for (let i = 0; i < middlewares.length; i++) {
		const middleware = middlewares[i];
		await middleware(context);
	}
}
