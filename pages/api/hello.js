import * as yup from "yup";
import { handleRequest } from "../../services/request-handler";

const configurarions = {
	GET: {
		authorization: "public",
		headers: {},
		body: {},
		query: yup.object().shape({
			name: yup.string().required()
		}),
		handler: onGet
	}
};

export default async function handler(req, res) {
	return await handleRequest(req, res, configurarions);
}

function onGet({ query }) {
	return {
		data: { message: `Hello ${query.name}` }
	};
}
