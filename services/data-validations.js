import { createClient } from "./supabase-client";

export async function verifyEmailExists(email) {
	const client = createClient();

	const emailQuery = await client
		.from("users")
		.select("email")
		.eq("email", email);

	return emailQuery.data.length > 0;
}

export async function verifyUsernameExists(username) {
	const client = createClient();

	const usernameQuery = await client
		.from("users")
		.select("username")
		.eq("username", username);

	return usernameQuery.data.length > 0;
}
