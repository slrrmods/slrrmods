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

async function onPost({ request, response, body }) {
	try {
		await quitCurrentSession(request, response);
	} catch (error) {
		return response.status(403).json({ error: error.message });
	}

	response.status(200).json({ message: "Success" });
}
