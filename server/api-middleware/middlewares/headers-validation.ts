import { CLIENT_HEADER_KEY, REQUEST_HEADER_KEY } from "@common/utils";
import { ApiHandlerContext } from "@server/api-handler";
import { MiddlewareError } from "@server/classes";
import * as yup from "yup";

const schema = yup.object().shape({
	[REQUEST_HEADER_KEY]: yup.string().required().uuid(),
	[CLIENT_HEADER_KEY]: yup.string().required().uuid(),
});

export async function validateHeaders(context: ApiHandlerContext) {
	const { request, methodConfiguration } = context;

	try {
		const result = await schema.validate({
			[REQUEST_HEADER_KEY]: request.headers[REQUEST_HEADER_KEY],
			[CLIENT_HEADER_KEY]: request.headers[CLIENT_HEADER_KEY],
		});

		context.headers.requestId = result[REQUEST_HEADER_KEY];
		context.headers.clientId = result[CLIENT_HEADER_KEY];
	} catch (error) {
		if (!(error instanceof yup.ValidationError)) return;
		throw new MiddlewareError(
			401,
			"Invalid request",
			`headers: ${error.message}`
		);
	}

	const validationSchema = methodConfiguration.headers;
	if (!validationSchema) return;

	const validationResult = await validationSchema.validate(request.headers);
	context.headers = {
		...validationResult,
		...context.headers,
	};
}
