import { ApiHandlerContext, EndpointConfiguration } from "@server/api-handler";
import { MiddlewareError } from "@server/classes";

export async function validateMethod(context: ApiHandlerContext) {
	const method = context.request.method;

	if (method === undefined) throw new Error("Undefined method");

	const methodConfiguration =
		context.endpointConfiguration[method as keyof EndpointConfiguration];

	if (methodConfiguration === undefined)
		throw new MiddlewareError(405, `Method '${method}' not allowed`);
}
