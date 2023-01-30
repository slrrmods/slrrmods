import * as yup from "yup";
import { hash, compare } from "bcrypt";
import { createClient } from "./supabase-client";
import { getFromId } from "./user-service";
import { sendHtml } from "./email-sender";
import { createRandomToken } from "../utils/tokenizer";
import { encrypt, decrypt } from "../utils/crypto";
import { createFromTemplate, EMAIL_TEMPLATES } from "../utils/email-templates";
import { ENVIROMENT_URL } from "../utils/constants";

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

	if (!user.email_confirmation_sent_at) throw new Error("Token expired");

	const now = new Date();
	const sentAt = new Date(user.email_confirmation_sent_at);
	const diff = now.getTime() - sentAt.getTime();
	const diffHours = Math.floor(diff / (1000 * 60 * 60));
	if (diffHours <= 48) throw new Error("Token is not expired");

	const tokenMatch = await compare(token.value, user.email_confirmation_token);
	if (!tokenMatch) throw new Error("Invalid token");

	await sendEmailVerification(user);
}

export async function sendEmailVerification(user) {
	const { email, username } = user;
	const token = await createToken(user);

	const html = createFromTemplate(EMAIL_TEMPLATES.CONFIRM_EMAIL, {
		username,
		tokenUrl: `${ENVIROMENT_URL}/verifyEmail?token=${token}`,
		year: new Date().getFullYear(),
	});

	await sendHtml(email, "Confirm your email", html);
}

export async function verifyEmail(encryptedToken) {
	const token = await validateToken(encryptedToken);
	const user = await getFromId(token.user);

	await client
		.from("users")
		.update({
			email_confirmed_at: new Date(),
			email_confirmation_token: null,
			email_confirmation_sent_at: null,
		})
		.eq("id", token.user);

	const date = new Intl.DateTimeFormat("en", {
		dateStyle: "medium",
		timeStyle: "medium",
	}).format(new Date());

	const html = createFromTemplate(EMAIL_TEMPLATES.CONFIRM_EMAIL_INFO, {
		username: user.username,
		date,
		rulesUrl: `${ENVIROMENT_URL}/rules`,
		year: new Date().getFullYear(),
	});

	await sendHtml(user.email, "Email confirmed", html);
}

async function validateToken(encryptedToken) {
	const token = await parseToken(encryptedToken);

	const user = await getFromId(token.user);
	if (!user) throw new Error("Invalid token");
	if (!user.active) throw new Error("User is not active");

	if (!user.email_confirmation_token)
		throw new Error("Email already confirmed");

	if (!user.email_confirmation_sent_at) throw new Error("Token expired");

	const now = new Date();
	const sentAt = new Date(user.email_confirmation_sent_at);
	const diff = now.getTime() - sentAt.getTime();
	const diffHours = Math.floor(diff / (1000 * 60 * 60));
	if (diffHours > 48) throw new Error("Token expired");

	const tokenMatch = await compare(token.value, user.email_confirmation_token);
	if (!tokenMatch) throw new Error("Invalid token");

	return token;
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
