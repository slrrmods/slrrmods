import * as yup from "yup";
import { handleRequest } from "../../../services/request-handler";
import { verifyEmailExists } from "../../../services/user-service";

const configurarions = {
	GET: {
		query: yup.object().shape({
			email: yup.string().required().email(),
		}),
		handler: onGet,
	},
};

export default async function handler(req, res) {
	return await handleRequest(req, res, configurarions);
}

async function onGet({ response, query }) {
	const { email } = query;

	if (await verifyEmailExists(email))
		return response.status(200).json({ error: "Email is already in use" });

	return response.status(200).json({ message: "Email is available" });
}
