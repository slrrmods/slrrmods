import * as yup from "yup";
import { requestHandler, supabaseClient } from "../../../services";

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

async function onGet(req, res) {
	const username = req.query.username;

	const client = supabaseClient.createClient();

	const { data } = await client
		.from("users")
		.select("username")
		.eq("username", username);

	if (data.length > 0)
		return res.status(200).json({ error: "Username is already in use" });

	return res.status(200).json({ message: "Username is available" });
}
