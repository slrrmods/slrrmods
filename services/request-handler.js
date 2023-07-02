import { log } from "next-axiom";
import { ValidationError } from "../classes";
import { IS_DEVELOPMENT_ENV } from "../utils/constants";
import runMiddlewares from "./api-middlewares";
import { logError, reportToEmail } from "./error-handling";

const defaultResult = {
	status: 200,
	data: { message: "Success" }
};

export async function handleRequest(request, response, configurations) {
	const context = {
		request,
		response,
		method: request.method,
		configuration: configurations[request.method]
	};

	try {
		await runMiddlewares(context);

		const { handler } = context.configuration;
		const handlerResult = await handler(context);
		const result = {
			...defaultResult,
			...handlerResult
		};

		return response.status(result.status).json(result.data);
	} catch (error) {
		if (error instanceof ValidationError) {
			const { status, message } = error;

			return response
				.status(status ?? 400)
				.json({ error: message ?? "Bad request" });
		}

		await handleError(error, request, response);
		return response.status(500).json({
			error: IS_DEVELOPMENT_ENV ? error.stack : "Internal server error"
		});
	}
}

async function handleError(error, request, response) {
	if (IS_DEVELOPMENT_ENV) {
		console.log(error);
		return;
	}

	try {
		const report = createErrorReport(error, request, response);
		log.error(error.message, report);
		await logError(error.message, report);
		await reportToEmail(error.message, report);
	} catch {}
}

function createErrorReport(error, request, response) {
	const errorInfos = {
		name: error.name,
		message: error.message,
		stack: error.stack,
		toString: error.toString()
	};

	const requestInfos = {
		httpVersion: request.httpVersion,
		complete: request.complete,
		rawHeaders: request.rawHeaders,
		rawTrailers: request.rawTrailers,
		aborted: request.aborted,
		upgrade: request.upgrade,
		url: request.url,
		method: request.method,
		statusCode: request.statusCode,
		statusMessage: request.statusMessage,
		query: request.query,
		body: request.body,
		ip: request.connection.remoteAddress
	};

	const responseInfos = {
		httpVersion: response.httpVersion,
		complete: response.complete,
		rawHeaders: response.rawHeaders,
		rawTrailers: response.rawTrailers,
		aborted: response.aborted,
		upgrade: response.upgrade,
		url: response.url,
		method: response.method,
		statusCode: response.statusCode,
		statusMessage: response.statusMessage,
		query: response.query,
		body: response.body
	};

	return {
		error: errorInfos,
		request: requestInfos,
		response: responseInfos
	};
}
