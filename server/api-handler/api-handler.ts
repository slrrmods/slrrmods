import { IS_DEV_ENV } from "@common/utils";
import { Endpoint, HandlerContext, Method } from "@server/api-handler";
import { runMiddlewares } from "@server/api-middleware";
import { MiddlewareError } from "@server/classes";
import { NextApiRequest, NextApiResponse } from "next";
import { ValidationError } from "yup";

const defaultMethodConfiguration: Method = {
	handler: (_: HandlerContext) => {
		throw new Error("Undefined endpoint handler");
	},
};

export async function handleRequest(
	request: NextApiRequest,
	response: NextApiResponse,
	endpointConfiguration: Endpoint
) {
	const method = request.method || "GET";
	const methodConfiguration = {
		...defaultMethodConfiguration,
		...endpointConfiguration[method as keyof Endpoint],
	};

	const context: HandlerContext = {
		request,
		response,
		method,
		methodConfiguration,
		endpointConfiguration,
		query: {},
		body: {},
		headers: {
			requestId: "",
			clientId: "",
		},
	};

	try {
		await runMiddlewares(context);

		const { handler } = methodConfiguration;

		const { status, data, error } = await handler(context);

		return response.status(status).json(error ?? data);
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
	const result: { error: string; details?: string } = {
		error: error.message,
	};

	if (IS_DEV_ENV && error.details) result.details = error.details;

	return response.status(error.status).json(result);
}

function handleGenericError(error: any, response: NextApiResponse) {
	console.log(error);

	return response.status(500).json({
		error: "Internal server error",
	});
}
