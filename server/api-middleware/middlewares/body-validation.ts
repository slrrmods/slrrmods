import { HandlerContext } from "@server/api-handler";

export async function validateBody(context: HandlerContext) {
	const { request, methodConfiguration } = context;
	const bodyValues = request.body;
	const bodySchema = methodConfiguration.body;

	if (!bodySchema) return;
	context.body = await bodySchema.validate(bodyValues);
}
