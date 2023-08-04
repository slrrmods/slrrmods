import {
	ApiHandlerContext,
	EndpointConfiguration,
	MethodConfiguration,
} from "@server/api-handler";
import { runMiddlewares } from "@server/api-middleware";
import { MiddlewareError } from "@server/classes";
import { NextApiRequest, NextApiResponse } from "next";
import { ValidationError } from "yup";

const defaultMethodConfiguration: MethodConfiguration = {
	handler: (_: ApiHandlerContext) => {
		throw new Error("Undefined endpoint handler");
	},
};

export async function handleRequest(
	request: NextApiRequest,
	response: NextApiResponse,
	endpointConfiguration: EndpointConfiguration
) {
	const method = request.method || "GET";
	const methodConfiguration = {
		...defaultMethodConfiguration,
		...endpointConfiguration[method as keyof EndpointConfiguration],
	};

	const context: ApiHandlerContext = {
		request,
		response,
		method,
		methodConfiguration,
		endpointConfiguration,
		query: {},
		body: {},
		headers: {},
	};

	try {
		await runMiddlewares(context);

		const { handler } = methodConfiguration;

		const result = await handler(context);

		return response.status(result.status).json(result.data ?? result.error);
	} catch (error) {
		return handleError(error, response);
	}
}

function handleError(error: any, response: NextApiResponse) {
	if (error instanceof ValidationError)
		return handleValidationError(error, response);

	if (error instanceof MiddlewareError)
		return handleMiddlewareError(error, response);

	return handleGenericError(error, response);
}

function handleValidationError(
	error: ValidationError,
	response: NextApiResponse
) {
	return response.status(400).json({
		error: error.errors,
	});
}

function handleMiddlewareError(
	error: MiddlewareError,
	response: NextApiResponse
) {
	return response.status(error.status).json({
		error: error.message,
	});
}

function handleGenericError(error: any, response: NextApiResponse) {
	console.log(error);

	return response.status(500).json({
		error: "Internal server error",
	});
}
