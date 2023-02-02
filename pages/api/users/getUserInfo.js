import { handleRequest } from "../../../services/request-handler";
import { getInfos } from "../../../services/user-service";

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
	const infos = await getInfos(user);

	return {
		data: infos,
	};
}
