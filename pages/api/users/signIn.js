import * as yup from "yup";
import { handleRequest } from "../../../services/request-handler";
import { joinNewSession } from "../../../services/session-manager";

const configurarions = {
	POST: {
		body: yup.object().shape({
			username: yup.string().required(),
			password: yup.string().required(),
			sso: yup.boolean().required(),
		}),
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
	const { username, password, sso } = body;

	try {
		await joinNewSession(username, password, sso, request, response);
	} catch (error) {
		return response.status(403).json({ error: error.message });
	}

	response.status(200).json({ message: "Success" });
}
