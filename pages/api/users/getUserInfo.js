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
	try {
		const session = await getCurrentSession(request, response);
		const user = await getInfos(session.owner);
		return response.status(200).json(user);
	} catch (error) {
		return response.status(400).json({ error: error.message });
	}
}
