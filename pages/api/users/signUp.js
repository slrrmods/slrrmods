import * as yup from "yup";
import { handleRequest } from "../../../services/request-handler";
import { createNew } from "../../../services/user-service";
import {
	emailValidation,
	passwordValidation,
	usernameValidation
} from "../../../utils/validations";

const configurarions = {
	POST: {
		body: yup.object().shape({
			email: emailValidation,
			username: usernameValidation,
			password: passwordValidation
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
	const { email, username, password } = body;

	await createNew(email, username, password);

	return {
		status: 201
	};
}
