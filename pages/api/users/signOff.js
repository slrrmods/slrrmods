import { handleRequest } from "../../../services/request-handler";
import { quitCurrentSession } from "../../../services/session-manager";

const configurarions = {
	POST: {
		handler: onPost,
		rateLimit: {
			limit: 5,
			interval: 60 * 1000,
		},
	},
};

export default async function handler(req, res) {
	return await handleRequest(req, res, configurarions);
}

async function onPost({ request, response }) {
	await quitCurrentSession(request, response);
}
