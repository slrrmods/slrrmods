import { hash } from "bcrypt";
import { createClient } from "./supabase-client";
import { sendEmailVerification } from "./email-verification";

const client = createClient();

export async function verifyEmailExists(email) {
	const { data } = await client
		.from("users")
		.select("email")
		.eq("email", email)
		.maybeSingle();

	return data !== null;
}

export async function verifyUsernameExists(username) {
	const { data } = await client
		.from("users")
		.select("username")
		.eq("username", username)
		.maybeSingle();

	return data !== null;
}

export async function getFromId(id) {
	const { data } = await client
		.from("users")
		.select()
		.eq("id", id)
		.maybeSingle();

	return data;
}

export async function getFromEmailOrUsername(emailOrUsername) {
	if (emailOrUsername.includes("@")) return await getFromEmail(emailOrUsername);
	return await getFromUsername(emailOrUsername);
}

export async function updateLastLogin(user) {
	await client
		.from("users")
		.update({ last_login: new Date() })
		.eq("id", user.id);
}

export async function createNew(email, username, password) {
	if (await verifyEmailExists(email))
		throw new Error("Email is already in use");

	if (await verifyUsernameExists(username))
		throw new Error("Username is already in use");

	const encryptedPassword = await hash(password, 10);

	const { data: user } = await client
		.from("users")
		.insert({
			email,
			username,
			password: encryptedPassword,
		})
		.select()
		.maybeSingle();

	await sendEmailVerification(user);

	return user;
}

async function getFromEmail(email) {
	const { data } = await client
		.from("users")
		.select()
		.eq("email", email)
		.maybeSingle();

	return data;
}

async function getFromUsername(username) {
	const { data } = await client
		.from("users")
		.select()
		.eq("username", username)
		.maybeSingle();

	return data;
}