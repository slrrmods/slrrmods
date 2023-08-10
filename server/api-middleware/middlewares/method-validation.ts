import { Endpoint, HandlerContext } from "@server/api-handler";
import { MiddlewareError } from "@server/classes";

export async function validateMethod(context: HandlerContext) {
	const method = context.request.method;

	if (method === undefined) throw new Error("Undefined method");

	const methodConfiguration =
		context.endpointConfiguration[method as keyof Endpoint];

	if (methodConfiguration === undefined)
		throw new MiddlewareError(405, `Method '${method}' not allowed`);
}
