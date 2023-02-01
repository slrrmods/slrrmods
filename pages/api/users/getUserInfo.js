import { handleRequest } from "../../../services/request-handler";
import { getInfos } from "../../../services/user-service";

const configurarions = {
	GET: {
		handler: onGet,
	},
};

export default async function handler(req, res) {
	return await handleRequest(req, res, configurarions);
}

async function onGet({ session }) {
	const user = await getInfos(session.owner);

	return {
		data: { user },
	};
}
