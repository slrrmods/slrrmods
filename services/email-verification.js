import { createClient } from "./supabase-client";
import { sendVerificationEmail } from "./email-sender";
import { newBase64Uuid } from "../utils/uuid";

export async function sendVerification(userId) {
	const client = createClient();

	const { data } = await client
		.from("users")
		.select("email, username")
		.eq("id", userId);

	if (!data || data.length === 0) throw new Error("User not found");

	const { email, username } = data[0];

	const token = newBase64Uuid();
	await client
		.from("users")
		.update({
			email_confirmation_token: token,
			email_confirmation_sent_at: new Date(),
		})
		.eq("id", userId);

	await sendVerificationEmail(email, username, token);
}
