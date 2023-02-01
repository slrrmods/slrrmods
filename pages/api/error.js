import { ValidationError } from "../../classes";
import { handleRequest } from "../../services/request-handler";

const configurarions = {
	GET: {
		authorization: "public",
		handler: onGet,
	},
};

export default async function handler(req, res) {
	return await handleRequest(req, res, configurarions);
}

function onGet() {
	throw new ValidationError("Test error");
}
