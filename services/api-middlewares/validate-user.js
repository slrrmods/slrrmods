import { getFromId, validateUser } from "../user-service";

export default async function validateCurrentUser(context) {
	const { session } = context;
	if (!session) return;

	const currentUser = await getFromId(session.owner);
	if (!currentUser) return;
	await validateUser(currentUser);
	context.user = currentUser;
}
