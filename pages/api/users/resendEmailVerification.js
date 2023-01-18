import * as yup from "yup";
import { handleRequest } from "../../../services/request-handler";
import { emailTokenValidation } from "../../../utils/validations";
import { isBase64Valid } from "../../../utils/uuid";
import { createClient } from "../../../services/supabase-client";
import { sendVerification } from "../../../services/email-verification";

const configurarion = {
	POST: {
		role: "public",
		query: yup.object().shape({
			token: emailTokenValidation,
		}),
		handler: onPost,
	},
};

export default function handler(req, res) {
	handleRequest(req, res, configurarion);
}

async function onPost(req, res) {
	const { token } = req.query;

	if (!isBase64Valid(token))
		return res.status(200).json({ error: "Invalid token" });

	const client = createClient();
	const { data } = await client
		.from("users")
		.select("id, email_confirmation_sent_at, email")
		.eq("email_confirmation_token", token);

	if (data.length === 0)
		return res.status(200).json({ error: "Invalid token" });

	const user = data[0];

	const now = new Date();
	const sentAt = new Date(user.email_confirmation_sent_at);
	const diff = now.getTime() - sentAt.getTime();
	const diffHours = Math.floor(diff / (1000 * 60 * 60));

	if (diffHours <= 48)
		return res.status(200).json({ error: "Token is not expired" });

	await sendVerification(user.id);

	return res.status(200).json({ message: "Success" });
}
