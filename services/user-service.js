import { hash, compare } from "bcrypt";
import { createClient } from "./supabase-client";
import { sendEmailVerification } from "./email-verification";
import { camelizeKeys } from "humps";
import { ValidationError } from "../classes";

const client = createClient();

export async function verifyEmailExists(email) {
	const { data } = await client
		.from("users")
		.select("email")
		.ilike("email", email)
		.maybeSingle();

	return data !== null;
}

export async function verifyUsernameExists(username) {
	const { data } = await client
		.from("users")
		.select("username")
		.ilike("username", username)
		.maybeSingle();

	return data !== null;
}

export async function getFromLogin(username, password) {
	const user = await getFromEmailOrUsername(username);

	const passwordMatch = await compare(password, user.password);
	if (!passwordMatch)
		throw new ValidationError("Invalid email/username or password");

	await validateUser(user);
	await updateLastLogin(user);

	return user;
}

export async function getInfos(user) {
	const userInfos = { ...user };

	userInfos.country = undefined;
	if (userInfos.id_country) {
		const { data } = await client
			.from("countries")
			.select()
			.eq("id", userInfos.country);

		userInfos.country = data;
	}

	delete userInfos.id_country;
	delete userInfos.email_confirmation_sent_at;
	delete userInfos.email_confirmation_token;
	delete userInfos.password;
	delete userInfos.password_recovered_at;
	delete userInfos.password_recovery_sent_at;
	delete userInfos.password_recovery_token;

	return camelizeKeys(userInfos);
}

export async function getFromId(id) {
	const { data } = await client
		.from("users")
		.select()
		.eq("id", id)
		.maybeSingle();

	if (!data) throw new ValidationError("Invalid email/username or password");

	return data;
}

export async function getFromEmailOrUsername(emailOrUsername) {
	if (emailOrUsername.includes("@")) return await getFromEmail(emailOrUsername);
	return await getFromUsername(emailOrUsername);
}

export async function getFromEmail(email) {
	const { data } = await client
		.from("users")
		.select()
		.ilike("email", email)
		.maybeSingle();

	if (!data) throw new ValidationError("Invalid email/username or password");

	return data;
}

export async function getFromUsername(username) {
	const { data } = await client
		.from("users")
		.select()
		.ilike("username", username)
		.maybeSingle();

	if (!data) throw new ValidationError("Invalid email/username or password");

	return data;
}

export async function validateUser(user) {
	//todo: check if user is not banned

	if (!user.active) throw new ValidationError("Account is not active");
}

export async function updateLastLogin(user) {
	await client
		.from("users")
		.update({ last_login: new Date() })
		.eq("id", user.id);
}

export async function createNew(email, username, password) {
	if (await verifyEmailExists(email))
		throw new ValidationError("Email is already in use");

	if (await verifyUsernameExists(username))
		throw new ValidationError("Username is already in use");

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
