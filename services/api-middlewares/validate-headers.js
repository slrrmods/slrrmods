import { ValidationError } from "../../classes";

export default async function validateHeaders(context) {
	const { request, configuration } = context;
	const headers = request.headers;
	const headersSchema = configuration.headers;

	if (!headers["request-token"])
		throw new ValidationError("Invalid request", 401);
	if (!headers["client-token"])
		throw new ValidationError("Invalid request", 401);

	context.headers = await validateSchema(headersSchema, headers);
}

async function validateSchema(schema, value) {
	if (schema === undefined) return {};
	if (schema.validate === undefined) return {};

	try {
		return await schema.validate(value);
	} catch (e) {
		throw new ValidationError(`Headers: ${e.message}`, 400);
	}
}
