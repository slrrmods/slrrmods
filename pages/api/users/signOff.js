import { revokeAll } from "../../../data/refresh-tokens";
import { handleRequest } from "../../../services/request-handler";
import { quitSession } from "../../../services/session-manager";

const configurarions = {
	POST: {
		authentication: true,
		handler: onPost,
		rateLimit: {
			limit: 5,
			interval: 60 * 1000
		}
	}
};

export default async function handler(req, res) {
	return await handleRequest(req, res, configurarions);
}

async function onPost({ request, response, session }) {
	await quitSession(session, request, response);
	await revokeAll(session);
}
