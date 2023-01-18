import * as yup from "yup";
import { handleRequest } from "../../../services/request-handler";
import { verifyUsernameExists } from "../../../services/data-validations";
import { usernameValidation } from "../../../utils/validations";

const configurarion = {
	GET: {
		role: "public",
		query: yup.object().shape({
			username: usernameValidation,
		}),
		handler: onGet,
	},
};

export default function handler(req, res) {
	handleRequest(req, res, configurarion);
}

async function onGet(req, res) {
	const username = req.query.username;

	if (await verifyUsernameExists(username))
		return res.status(200).json({ error: "Username is already in use" });

	return res.status(200).json({ message: "Username is available" });
}
