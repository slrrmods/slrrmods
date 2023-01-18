import * as bcrypt from "bcrypt";
import * as yup from "yup";
import { createClient } from "../../../services/supabase-client";
import { handleRequest } from "../../../services/request-handler";
import { sendVerification } from "../../../services/email-verification";
import {
	emailValidation,
	usernameValidation,
	passwordValidation,
} from "../../../utils/validations";
import {
	verifyEmailExists,
	verifyUsernameExists,
} from "../../../services/data-validations";

const configurarion = {
	POST: {
		role: "public",
		body: yup.object().shape({
			email: emailValidation,
			username: usernameValidation,
			password: passwordValidation,
		}),
		handler: onPost,
	},
};

export default function handler(req, res) {
	handleRequest(req, res, configurarion);
}

async function onPost(req, res) {
	const { email, username, password } = req.body;

	if (await verifyEmailExists(email))
		return res.status(200).json({ error: "Email is already in use" });

	if (await verifyUsernameExists(username))
		return res.status(200).json({ error: "Username is already in use" });

	const encryptedPassword = await bcrypt.hash(password, 10);

	const client = createClient();

	const insertUserQuery = await client
		.from("users")
		.insert({
			email,
			username,
			password: encryptedPassword,
		})
		.select();

	if (insertUserQuery.error) return res.status(200).json({ error });

	const user = insertUserQuery.data[0];

	await sendVerification(user.id);

	return res.status(201).json({ message: "Success" });
}
