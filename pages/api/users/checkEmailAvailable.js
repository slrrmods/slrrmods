import * as yup from "yup";
import { requestHandler, supabaseClient } from "../../../services";

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

async function onGet(req, res) {
	const email = req.query.email;

	const client = supabaseClient.createClient();

	const { data } = await client.from("emails").select().eq("email", email);

	if (data.length > 0)
		return res.status(200).json({ error: "Email is already in use" });

	return res.status(200).json({ message: "Email is available" });
}
