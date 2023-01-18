export async function handleRequest(request, response, configuration) {
	const methodConfiguration = configuration[request.method];

	try {
		validateMethod(request, methodConfiguration);

		//todo: validate role

		await validateHeaders(request, methodConfiguration);
		await validateQuery(request, methodConfiguration);
		await validateBody(request, methodConfiguration);
	} catch ({ status, message }) {
		return response
			.status(status ?? 400)
			.json({ error: message ?? "Bad request" });
	}

	try {
		const { handler } = methodConfiguration;

		return await handler(request, response);
	} catch (e) {
		//todo: log error to supabase

		console.log(e);
		return response.status(500).json({ error: "Internal server error" });
	}

	return response.status(418).send();
}

function validateMethod(request, configuration) {
	if (configuration === undefined) {
		throw { status: 405, message: `Method '${request.method}' not allowed` };
	}
}

async function validateHeaders(request, configuration) {
	const headers = request.headers;
	const headersSchema = configuration.headers;

	await validateSchema(headersSchema, headers, "Headers");
}

async function validateQuery(request, configuration) {
	const query = request.query;
	const querySchema = configuration.query;

	await validateSchema(querySchema, query, "Query parameters");
}

async function validateBody(request, configuration) {
	const body = request.body;
	const bodySchema = configuration.body;

	await validateSchema(bodySchema, body, "Body");
}

async function validateSchema(schema, value, scope) {
	if (schema === undefined) return;

	try {
		await schema.validate(value);
	} catch (e) {
		if (e instanceof TypeError) return;

		throw { status: 400, message: `${scope}: ${e.errors[0]}` };
	}
}
