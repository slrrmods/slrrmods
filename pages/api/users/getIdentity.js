import { handleRequest } from "../../../services/request-handler";

const configurarions = {
	GET: {
		authentication: true,
		handler: onGet,
	},
};

export default async function handler(req, res) {
	return await handleRequest(req, res, configurarions);
}

async function onGet({ user }) {
	return {
		data: {
			id: user.id,
			username: user.username,
			profilePicture: user.profilePicture,
		},
	};
}
