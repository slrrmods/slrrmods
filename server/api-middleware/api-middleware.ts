import { ApiHandlerContext } from "@server/api-handler";
import {
	applyRateLimiting,
	validateHeaders,
	validateMethod,
} from "./middlewares";

const middlewares = [validateMethod, applyRateLimiting, validateHeaders];

export async function runMiddlewares(context: ApiHandlerContext) {
	for (const middleware of middlewares) {
		await middleware(context);
	}
}
