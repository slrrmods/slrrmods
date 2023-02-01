import * as yup from "yup";
import { handleRequest } from "../../../services/request-handler";
import { resendEmailVerification } from "../../../services/email-verification";

const configurarions = {
	POST: {
		query: yup.object().shape({
			token: yup.string().required(),
		}),
		handler: onPost,
		rateLimit: {
			limit: 2,
			interval: 2 * 60 * 1000,
		},
	},
};

export default async function handler(req, res) {
	return await handleRequest(req, res, configurarions);
}

async function onPost({ query }) {
	const { token } = query;

	await resendEmailVerification(token);
}
