import { validateCurrentSession } from "../session-manager";

export default async function validateSession(context) {
	const { request, response } = context;

	context.session = await validateCurrentSession(request, response);
}
