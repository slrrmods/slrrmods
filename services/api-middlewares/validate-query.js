import { ValidationError } from "../../classes";

export default async function validateQuery(context) {
	const { request, configuration } = context;
	const query = request.query;
	const querySchema = configuration.query;

	context.query = await validateSchema(querySchema, query);
}

async function validateSchema(schema, value) {
	if (schema === undefined) return {};
	if (schema.validate === undefined) return {};

	try {
		return await schema.validate(value);
	} catch (e) {
		throw new ValidationError(`Query: ${e.message}`, 400);
	}
}
