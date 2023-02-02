import { getCurrentSession, validateSession } from "../session-manager";

export default async function validateCurrentSession(context) {
	const { request, response } = context;

	const currentSession = await getCurrentSession(request, response);
	if (!currentSession) return;
	await validateSession(currentSession, request, response);
	context.session = currentSession;
}
