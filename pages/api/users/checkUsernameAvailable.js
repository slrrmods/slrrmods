import * as yup from "yup";
import { requestHandler } from "../../../services";

const configurarion = {
	GET: {
		role: "public",
		query: yup.object().shape({
			username: yup.string().required(),
		}),
		handler: onGet,
	},
};

export default function handler(req, res) {
	requestHandler.handleRequest(req, res, configurarion);
}

function onGet(req, res) {
	const username = req.query.username;

	if (username === "adnan54")
		return res.status(200).json({ error: "Username is already in use" });

	return res.status(200).json({ message: "Username is available" });
}
