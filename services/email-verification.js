import * as yup from "yup";
import { hash, compare } from "bcrypt";
import { createClient } from "./supabase-client";
import { getFromId } from "./user-service";
import { sendVerificationEmail } from "./email-sender";
import { createRandomToken } from "../utils/tokenizer";
import { encrypt, decrypt } from "../utils/crypto";

const tokenSchema = yup.object().shape({
	user: yup.string().required(),
	value: yup.string().required(),
});

const client = createClient();

export async function resendEmailVerification(encryptedToken) {
	const token = await parseToken(encryptedToken);

	const user = await getFromId(token.user);
	if (!user) throw new Error("Invalid token");

	if (!user.email_confirmation_token)
		throw new Error("Email already confirmed");

	const tokenMatch = await compare(token.value, user.email_confirmation_token);
	if (!tokenMatch) throw new Error("Invalid token");

	const now = new Date();
	const sentAt = new Date(user.email_confirmation_sent_at);
	const diff = now.getTime() - sentAt.getTime();
	const diffHours = Math.floor(diff / (1000 * 60 * 60));
	if (diffHours <= 48) throw new Error("Token is not expired");

	await sendEmailVerification(user);
}

export async function sendEmailVerification(user) {
	const { email, username } = user;
	const token = await createToken(user);
	await sendVerificationEmail(email, username, token);
}

export async function validateToken(encryptedToken) {
	const token = await parseToken(encryptedToken);

	const user = await getFromId(token.user);
	if (!user) throw new Error("Invalid token");

	if (!user.email_confirmation_token)
		throw new Error("Email already confirmed");

	const tokenMatch = await compare(token.value, user.email_confirmation_token);
	if (!tokenMatch) throw new Error("Invalid token");

	const now = new Date();
	const sentAt = new Date(user.email_confirmation_sent_at);
	const diff = now.getTime() - sentAt.getTime();
	const diffHours = Math.floor(diff / (1000 * 60 * 60));
	if (diffHours > 48) throw new Error("Token expired");

	await client
		.from("users")
		.update({
			email_confirmed_at: new Date(),
			email_confirmation_token: null,
			email_confirmation_sent_at: null,
		})
		.eq("id", user.id);
}

async function createToken(user) {
	const tokenObject = {
		user: user.id,
		value: createRandomToken(),
	};

	const hashedTokenValue = await hash(tokenObject.value, 10);
	await client
		.from("users")
		.update({
			email_confirmation_token: hashedTokenValue,
			email_confirmation_sent_at: new Date(),
		})
		.eq("id", user.id);

	return encrypt(JSON.stringify(tokenObject));
}

async function parseToken(encryptedToken) {
	try {
		const decryptedToken = decrypt(encryptedToken);
		const parsedToken = JSON.parse(decryptedToken);
		return await tokenSchema.validate(parsedToken);
	} catch {
		throw new Error("Invalid token");
	}
}
