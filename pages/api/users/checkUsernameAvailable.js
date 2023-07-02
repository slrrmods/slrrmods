import * as yup from "yup";
import { handleRequest } from "../../../services/request-handler";
import { verifyUsernameExists } from "../../../services/user-service";

const configurarions = {
	GET: {
		query: yup.object().shape({
			username: yup.string().required()
		}),
		handler: onGet,
		rateLimit: {
			limit: 10,
			interval: 30 * 1000
		}
	}
};

export default async function handler(req, res) {
	return await handleRequest(req, res, configurarions);
}

async function onGet({ query }) {
	const { username } = query;

	if (await verifyUsernameExists(username)) {
		return {
			data: { error: "Username is already in use" }
		};
	}

	return {
		data: { message: "Username is available" }
	};
}
