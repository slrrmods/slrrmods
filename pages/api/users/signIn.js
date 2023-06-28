import * as yup from "yup";
import { getById } from "../../../data/countries";
import { createNew, revokeAll } from "../../../data/refresh-tokens";
import { handleRequest } from "../../../services/request-handler";
import { joinNewSession, quitSession } from "../../../services/session-manager";
import { getFromEmailOrUsername } from "../../../services/user-service";

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

async function onPost({ request, response, body, session }) {
	if (session) await quitSession(session);

	const newSession = await joinNewSession({
		...body,
		request,
		response,
	});

	const user = await getFromEmailOrUsername(body.username);
	const country = await getById(user.country);

	const userInfo = {
		username: user.username,
		email: user.email,
		profilePicture: user.profile_picture,
		country,
	};

	const sessionInfo = {
		expiresAt: newSession.expiresAt,
	};

	if (sso) sessionInfo.refreshToken = await createNew(newSession);

	return {
		data: {
			userInfo,
			sessionInfo,
		},
	};
}
