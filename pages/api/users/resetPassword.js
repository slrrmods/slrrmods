import * as yup from "yup";
import { handleRequest } from "../../../services/request-handler";
import { resetPassword } from "../../../services/reset-password";
import { passwordValidation } from "../../../utils/validations";

const configurarions = {
	POST: {
		authorization: "public",
		body: yup.object().shape({
			token: yup.string().required(),
			password: passwordValidation
		}),
		handler: onPost,
		rateLimit: {
			limit: 2,
			interval: 60 * 1000
		}
	}
};

export default async function handler(req, res) {
	return await handleRequest(req, res, configurarions);
}

async function onPost({ body }) {
	const { token, password } = body;

	await resetPassword(token, password);
}
