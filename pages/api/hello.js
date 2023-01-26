import * as yup from "yup";
import { handleRequest } from "../../services/request-handler";

const configurarions = {
	GET: {
		authorization: "public",
		headers: {},
		body: {},
		query: yup.object().shape({
			name: yup.string().required(),
		}),
		handler: onGet,
		rateLimit: {
			limit: 10,
		},
	},
};

export default async function handler(req, res) {
	return await handleRequest(req, res, configurarions);
}

function onGet({ response, query }) {
	return response.status(200).json({ message: `Hello ${query.name}` });
}
