import * as yup from "yup";
import { handleRequest } from "../../../services/request-handler";
import { verifyEmail } from "../../../services/email-verification";

const configurarions = {
	GET: {
		query: yup.object().shape({
			token: yup.string().required(),
		}),
		handler: onGet,
		rateLimit: {
			limit: 3,
			interval: 60 * 1000,
		},
	},
};

export default async function handler(req, res) {
	return await handleRequest(req, res, configurarions);
}

async function onGet({ query }) {
	const { token } = query;

	await verifyEmail(token);
}
