import * as yup from "yup";
import { handleRequest } from "../../../services/request-handler";
import { verifyEmailExists } from "../../../services/data-validations";
import { emailValidation } from "../../../utils/validations";

const configurarion = {
	GET: {
		role: "public",
		query: yup.object().shape({
			email: emailValidation,
		}),
		handler: onGet,
	},
};

export default function handler(req, res) {
	handleRequest(req, res, configurarion);
}

async function onGet(req, res) {
	const email = req.query.email;

	if (await verifyEmailExists(email))
		return res.status(200).json({ error: "Email is already in use" });

	return res.status(200).json({ message: "Email is available" });
}
