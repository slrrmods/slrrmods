import * as yup from "yup";
import { handleRequest } from "../../../services/request-handler";
import { sendResetPassword } from "../../../services/reset-password";
import { getFromEmail } from "../../../services/user-service";
import { emailValidation } from "../../../utils/validations";

const configurarions = {
	POST: {
		authorization: "public",
		body: yup.object().shape({
			email: emailValidation
		}),
		handler: onPost,
		rateLimit: {
			limit: 5,
			interval: 60 * 1000
		}
	}
};

export default async function handler(req, res) {
	return await handleRequest(req, res, configurarions);
}

async function onPost({ body }) {
	const { email } = body;

	let user = undefined;
	try {
		user = await getFromEmail(email);
	} catch {}

	if (!user) {
		await new Promise((resolve) => setTimeout(resolve, 3000));
	} else await sendResetPassword(user);
}
