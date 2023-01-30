import * as yup from "yup";
import { handleRequest } from "../../../services/request-handler";
import { emailValidation } from "../../../utils/validations";
import { getFromEmail } from "../../../services/user-service";
import { sendResetPassword } from "../../../services/reset-password";

const configurarions = {
	POST: {
		authorization: "public",
		body: yup.object().shape({
			email: emailValidation,
		}),
		handler: onPost,
		rateLimit: {
			limit: 5,
			interval: 60 * 1000,
		},
	},
};

export default async function handler(req, res) {
	return await handleRequest(req, res, configurarions);
}

async function onPost({ response, body }) {
	const { email } = body;
	const user = await getFromEmail(email);

	if (!user) return response.status(200).json({ message: "Success" });

	try {
		await sendResetPassword(user);
	} finally {
		return response.status(200).json({ message: "Success" });
	}
}
