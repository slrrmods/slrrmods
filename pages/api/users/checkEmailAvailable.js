import * as yup from "yup";
import { requestHandler } from "../../../services";

const configurarion = {
	GET: {
		role: "public",
		query: yup.object().shape({
			email: yup.string().required(),
		}),
		handler: onGet,
	},
};

export default function handler(req, res) {
	requestHandler.handleRequest(req, res, configurarion);
}

function onGet(req, res) {
	const email = req.query.email;

	if (email === "a@a.com")
		return res.status(200).json({ error: "Email is already in use" });

	return res.status(200).json({ message: "Email is available" });
}
