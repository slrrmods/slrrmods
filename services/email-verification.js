import { compare, hash } from "bcrypt";
import * as yup from "yup";
import { ValidationError } from "../classes";
import { ENVIROMENT_URL } from "../utils/constants";
import { decrypt, encrypt } from "../utils/crypto";
import { EMAIL_TEMPLATES, createFromTemplate } from "../utils/email-templates";
import { createRandomToken } from "../utils/tokenizer";
import { sendHtml } from "./email-sender";
import { createClient } from "./supabase-client";
import { getFromId } from "./user-service";

const tokenSchema = yup.object().shape({
	user: yup.string().required(),
	value: yup.string().required()
});

const client = createClient();

export async function resendEmailVerification(encryptedToken) {
	const token = await parseToken(encryptedToken);
	const user = await getFromId(token.user);

	if (!user.email_confirmation_token)
		throw new ValidationError("Email already confirmed");

	if (!user.email_confirmation_sent_at)
		throw new ValidationError("Token expired");

	const now = new Date();
	const sentAt = new Date(user.email_confirmation_sent_at);
	const diff = now.getTime() - sentAt.getTime();
	const diffHours = Math.floor(diff / (1000 * 60 * 60));
	if (diffHours <= 48) throw new ValidationError("Token is not expired");

	const tokenMatch = await compare(token.value, user.email_confirmation_token);
	if (!tokenMatch) throw new ValidationError("Invalid token");

	await sendEmailVerification(user);
}

export async function sendEmailVerification(user) {
	const { email, username } = user;
	const token = await createToken(user);

	const html = createFromTemplate(EMAIL_TEMPLATES.CONFIRM_EMAIL, {
		username,
		tokenUrl: `${ENVIROMENT_URL}/verifyEmail?token=${token}`,
		year: new Date().getFullYear()
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
			email_confirmation_sent_at: null
		})
		.eq("id", token.user);

	const date = new Intl.DateTimeFormat("en", {
		dateStyle: "medium",
		timeStyle: "medium"
	}).format(new Date());

	const html = createFromTemplate(EMAIL_TEMPLATES.CONFIRM_EMAIL_INFO, {
		username: user.username,
		date,
		rulesUrl: `${ENVIROMENT_URL}/rules`,
		year: new Date().getFullYear()
	});

	await sendHtml(user.email, "Email confirmed", html);
}

async function validateToken(encryptedToken) {
	const token = await parseToken(encryptedToken);

	const user = await getFromId(token.user);
	if (!user.active) throw new ValidationError("User is not active");

	if (!user.email_confirmation_token)
		throw new ValidationError("Email already confirmed");

	if (!user.email_confirmation_sent_at)
		throw new ValidationError("Token expired");

	const now = new Date();
	const sentAt = new Date(user.email_confirmation_sent_at);
	const diff = now.getTime() - sentAt.getTime();
	const diffHours = Math.floor(diff / (1000 * 60 * 60));
	if (diffHours > 48) throw new ValidationError("Token expired");

	const tokenMatch = await compare(token.value, user.email_confirmation_token);
	if (!tokenMatch) throw new ValidationError("Invalid token");

	return token;
}

async function createToken(user) {
	const tokenObject = {
		user: user.id,
		value: createRandomToken()
	};

	const hashedTokenValue = await hash(tokenObject.value, 10);
	await client
		.from("users")
		.update({
			email_confirmation_token: hashedTokenValue,
			email_confirmation_sent_at: new Date()
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
		throw new ValidationError("Invalid token");
	}
}
