import { ApiHandlerContext } from "../api-handler";
import { applyRateLimiting, validateMethod } from "./middlewares";

const middlewares = [validateMethod, applyRateLimiting];

export async function runMiddlewares(context: ApiHandlerContext) {
	for (const middleware of middlewares) {
		await middleware(context);
	}
}
