import { ValidationError } from "../../classes";

export default async function validateBody(context) {
	const { request, configuration } = context;
	const body = request.body;
	const bodySchema = configuration.body;

	context.body = await validateSchema(bodySchema, body);
}

async function validateSchema(schema, value) {
	if (schema === undefined) return {};
	if (schema.validate === undefined) return {};

	try {
		return await schema.validate(value);
	} catch (e) {
		throw new ValidationError(`Body: ${e.message}`, 400);
	}
}
