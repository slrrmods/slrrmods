import * as bcrypt from "bcrypt";
import * as yup from "yup";
import { requestHandler, supabaseClient } from "../../../services";

const configurarion = {
	POST: {
		role: "public",
		body: yup.object().shape({
			email: yup
				.string()
				.required("Email is required")
				.min(3, "Email must have at least 3 characters")
				.max(64, "Email must have at most 64 characters")
				.email("Email is not valid"),
			username: yup
				.string()
				.required("Username is required")
				.min(3, "Username must have at least 3 characters")
				.max(32, "Username must have at most 32 characters")
				.matches(
					"^[a-zA-Z0-9_]+$",
					"Username must contain only letters, numbers and underscores"
				),
			password: yup
				.string()
				.required("Password is required")
				.min(8, "Password must have at least 8 characters")
				.matches("[0-9]", "Password must contain at least one number")
				.matches("[a-z]", "Password must contain at least one lowercase letter")
				.matches("[A-Z]", "Password must contain at least one uppercase letter")
				.matches(
					"[ !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~]",
					"Password must contain at least one special character"
				),
		}),
		handler: onPost,
	},
};

export default function handler(req, res) {
	requestHandler.handleRequest(req, res, configurarion);
}

async function onPost(req, res) {
	const { email, username, password } = req.body;
	const client = supabaseClient.createClient();

	const emailQuery = await client
		.from("users")
		.select("email")
		.eq("email", email);
	if (emailQuery.data.length > 0)
		return res.status(200).json({ error: "Email is already in use" });

	const usernameQuery = await client
		.from("users")
		.select("username")
		.eq("username", username);
	if (usernameQuery.data.length > 0)
		return res.status(200).json({ error: "Username is already in use" });

	const encryptedPassword = await bcrypt.hash(password, 10);

	const { data, error } = await client
		.from("users")
		.insert({
			email,
			username,
			password: encryptedPassword,
		})
		.select();

	if (error) return res.status(200).json({ error });

	//todo: create email verification token and send email

	return res
		.status(201)
		.json({ id: data[0].id, message: "user signed up successfully" });
}
