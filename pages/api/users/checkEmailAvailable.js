import * as yup from "yup";
import { handleRequest } from "../../../services/request-handler";
import { verifyEmailExists } from "../../../services/user-service";

const configurarions = {
	GET: {
		query: yup.object().shape({
			email: yup.string().required().email(),
		}),
		handler: onGet,
		rateLimit: {
			limit: 10,
			interval: 30 * 1000,
		},
	},
};

export default async function handler(req, res) {
	return await handleRequest(req, res, configurarions);
}

async function onGet({ query }) {
	const { email } = query;

	if (await verifyEmailExists(email)) {
		return {
			data: { error: "Email is already in use" },
		};
	}

	return {
		data: { message: "Email is available" },
	};
}
