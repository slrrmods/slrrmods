import * as yup from "yup";
import { verifyEmail } from "../../../services/email-verification";
import { handleRequest } from "../../../services/request-handler";

const configurarions = {
	GET: {
		query: yup.object().shape({
			token: yup.string().required()
		}),
		handler: onGet,
		rateLimit: {
			limit: 3,
			interval: 60 * 1000
		}
	}
};

export default async function handler(req, res) {
	return await handleRequest(req, res, configurarions);
}

async function onGet({ query }) {
	const { token } = query;

	await verifyEmail(token);
}
