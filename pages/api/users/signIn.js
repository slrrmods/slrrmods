import * as yup from "yup";
import { compare } from "bcrypt";
import { handleRequest } from "../../../services/request-handler";
import { joinNewSession } from "../../../services/session-manager";
import {
	getFromEmailOrUsername,
	updateLastLogin,
} from "../../../services/user-service";

const configurarions = {
	POST: {
		body: yup.object().shape({
			username: yup.string().required(),
			password: yup.string().required(),
			sso: yup.boolean().required(),
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

async function onPost({ request, response, body }) {
	const { username, password, sso } = body;

	const user = await getFromEmailOrUsername(username);

	if (!user)
		return response
			.status(403)
			.json({ error: "Invalid email/username or password" });

	if (!user.active)
		return response.status(403).json({ error: "Account is not active" });

	const passwordMatch = await compare(password, user.password);
	if (!passwordMatch)
		return response
			.status(403)
			.json({ error: "Invalid email/username or password" });

	//todo: check if user is banned

	await joinNewSession(user, sso, request, response);
	await updateLastLogin(user);

	response
		.status(200)
		.json({ message: "Success", user: { id: user.id, username } });
}
