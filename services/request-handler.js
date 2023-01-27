import { ENVIROMENT_URL } from "../utils/constants";
import { log } from "next-axiom";
import { getIp } from "../utils/ip";
import { logError, reportToEmail } from "./error-handling";
import rateLimit from "./rate-limit";

export async function handleRequest(request, response, configurations) {
	const method = request.method;
	const configuration = configurations[method];

	const context = {
		request,
		response,
		method,
		configuration,
	};

	try {
		validateMethod(request, configuration);
		applyRateLimit(request, response, configuration);

		//todo: validate authorizaiton and include user in context

		context.headers = await validateHeaders(request, configuration);
		context.query = await validateQuery(request, configuration);
		context.body = await validateBody(request, configuration);
	} catch ({ status, message }) {
		return response
			.status(status ?? 400)
			.json({ error: message ?? "Bad request" });
	}

	try {
		const { handler } = configuration;
		return await handler(context);
	} catch (error) {
		await handleError(error, request, response);
		return response.status(500).json({ error: "Internal server error" });
	}
}

async function handleError(error, request, response) {
	try {
		const errorInfos = {
			message: error.message,
			stack: error.stack,
			toString: error.toString(),
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
			ip: request.connection.remoteAddress,
		};

		const responseInfos = {
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
		};

		const context = {
			error: errorInfos,
			request: requestInfos,
			response: responseInfos,
		};

		log.error(error.message, context);
		await logError(error.message, context);
		await reportToEmail(error.message, context);
	} catch {}
}

function validateMethod(request, configuration) {
	if (configuration === undefined)
		throw { status: 405, message: `Method '${request.method}' not allowed` };
}

const rateLimiters = {};
const defaultLimitConfiguration = {
	limit: 5,
	interval: 60 * 1000,
	usersPerSecond: 100,
};

function applyRateLimit(request, response, configuration) {
	const { limit, interval, usersPerSecond } = {
		...defaultLimitConfiguration,
		...configuration.rateLimit,
	};

	const url = new URL(request.url, ENVIROMENT_URL);
	const endPoint = url.pathname;

	if (!rateLimiters[endPoint])
		rateLimiters[endPoint] = rateLimit(limit, interval, usersPerSecond);

	const limiter = rateLimiters[endPoint];

	const token = getIp(request);

	try {
		limiter.check(token, response);
	} catch {
		throw { status: 429, message: "Too many requests" };
	}
}

async function validateHeaders(request, configuration) {
	const headers = request.headers;
	const headersSchema = configuration.headers;

	if (!headers["request-token"])
		throw { status: 401, message: "Invalid request" };

	if (!headers["client-token"])
		throw { status: 401, message: "Invalid request" };

	return await validateSchema(headersSchema, headers, "Headers");
}

async function validateQuery(request, configuration) {
	const query = request.query;
	const querySchema = configuration.query;

	return await validateSchema(querySchema, query, "Query parameters");
}

async function validateBody(request, configuration) {
	const body = request.body;
	const bodySchema = configuration.body;

	return await validateSchema(bodySchema, body, "Body");
}

async function validateSchema(schema, value, scope) {
	if (schema === undefined) return {};
	if (schema.validate === undefined) return {};

	try {
		return await schema.validate(value);
	} catch (e) {
		throw { status: 400, message: `${scope}: ${e.message}` };
	}
}
