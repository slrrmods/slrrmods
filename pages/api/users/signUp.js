import * as yup from "yup";
import { handleRequest } from "../../../services/request-handler";
import {
	emailValidation,
	usernameValidation,
	passwordValidation,
} from "../../../utils/validations";
import { createNew } from "../../../services/user-service";

const configurarions = {
	POST: {
		body: yup.object().shape({
			email: emailValidation,
			username: usernameValidation,
			password: passwordValidation,
		}),
		handler: onPost,
	},
};

export default async function handler(req, res) {
	return await handleRequest(req, res, configurarions);
}

async function onPost({ response, body }) {
	const { email, username, password } = body;

	try {
		await createNew(email, username, password);
	} catch (error) {
		return response.status(400).json({ error: error.message });
	}

	return response.status(201).json({ message: "Success" });
}
