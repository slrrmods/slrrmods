import * as yup from "yup";
import { handleRequest } from "../../../services/request-handler";
import { validateToken } from "../../../services/email-verification";

const configurarions = {
	GET: {
		query: yup.object().shape({
			token: yup.string().required(),
		}),
		handler: onGet,
	},
};

export default async function handler(req, res) {
	return await handleRequest(req, res, configurarions);
}

async function onGet({ response, query }) {
	const { token } = query;

	try {
		await validateToken(token);
	} catch (error) {
		return response.status(403).json({ error: error.message });
	}

	return response.status(200).json({ message: "success" });
}
