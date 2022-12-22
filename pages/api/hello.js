import * as yup from "yup";
import { requestHandler } from "../../utils";

const configurarion = {
	GET: {
		role: "public",
		headers: {},
		body: {},
		query: yup.object().shape({
			name: yup.string().required(),
		}),
		handler: onGet,
	},
};

export default function handler(req, res) {
	requestHandler.handleRequest(req, res, configurarion);
}

function onGet(req, res) {
	return res.status(200).json({ message: `Hello ${req.query.name}` });
}
