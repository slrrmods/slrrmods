import { ApiHandlerContext } from "@server/api-handler";
import {
	applyRateLimiting,
	validateBody,
	validateHeaders,
	validateMethod,
	validateQuery,
} from "./middlewares";

const middlewares = [
	validateMethod,
	applyRateLimiting,
	validateHeaders,
	validateQuery,
	validateBody,
];

export async function runMiddlewares(context: ApiHandlerContext) {
	for (const middleware of middlewares) {
		await middleware(context);
	}
}
