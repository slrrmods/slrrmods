import { handleRequest } from "../../../services/request-handler";
import { getCurrentSession } from "../../../services/session-manager";
import { getInfos } from "../../../services/user-service";

const configurarions = {
	GET: {
		handler: onGet,
	},
};

export default async function handler(req, res) {
	return await handleRequest(req, res, configurarions);
}

async function onGet({ request, response }) {
	const session = await getCurrentSession(request, response);
	const user = await getInfos(session.owner);

	return {
		data: { user },
	};
}
