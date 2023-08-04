import { ApiHandlerContext } from "@server/api-handler";

export async function validateQuery(context: ApiHandlerContext) {
	const { request, methodConfiguration } = context;
	const queryValues = request.query;
	const querySchema = methodConfiguration.query;

	if (!querySchema) return;
	context.query = await querySchema.validate(queryValues);
}
