import { compare, hash } from "bcrypt";
import * as yup from "yup";
import { ValidationError } from "../classes";
import { ENVIROMENT_URL } from "../utils/constants";
import { decrypt, encrypt } from "../utils/crypto";
import { EMAIL_TEMPLATES, createFromTemplate } from "../utils/email-templates";
import { createRandomToken } from "../utils/tokenizer";
import { sendHtml } from "./email-sender";
import { revokeAllSessions } from "./session-manager";
import { createClient } from "./supabase-client";
import { getFromId } from "./user-service";

const tokenSchema = yup.object().shape({
	user: yup.string().required(),
	value: yup.string().required()
});

const client = createClient();

export async function sendResetPassword(user) {
	const { email, username } = user;
	const token = await createToken(user);

	const html = createFromTemplate(EMAIL_TEMPLATES.RESET_PASSWORD, {
		username,
		tokenUrl: `${ENVIROMENT_URL}/resetPassword?token=${token}`,
		year: new Date().getFullYear()
	});

	await sendHtml(email, "Reset your password", html);
}

export async function resetPassword(encryptedToken, newPassword) {
	const token = await validateToken(encryptedToken);
	const user = await getFromId(token.user);

	await revokeAllSessions(user);

	const hashedPassword = await hash(newPassword, 10);
	await client
		.from("users")
		.update({
			password: hashedPassword,
			password_recovery_token: null,
			password_recovery_sent_at: null,
			password_recovered_at: new Date()
		})
		.eq("id", user.id);

	const date = new Intl.DateTimeFormat("en", {
		dateStyle: "medium",
		timeStyle: "medium"
	}).format(new Date());

	const html = createFromTemplate(EMAIL_TEMPLATES.RESET_PASSWORD_INFO, {
		username: user.username,
		date,
		resetPasswordUrl: `${ENVIROMENT_URL}/users/forgotPassword`,
		year: new Date().getFullYear()
	});

	await sendHtml(user.email, "Password updated", html);
}

export async function validateToken(encryptedToken) {
	const token = await parseToken(encryptedToken);

	const user = await getFromId(token.user);
	if (!user.active) throw new ValidationError("User is not active");

	if (!user.password_recovery_token)
		throw new ValidationError("Password already reset");
	if (!user.password_recovery_sent_at)
		throw new ValidationError("Token expired");

	const now = new Date();
	const sentAt = new Date(user.password_recovery_sent_at);
	const diff = now.getTime() - sentAt.getTime();
	const diffHours = Math.floor(diff / (1000 * 60 * 60));
	if (diffHours > 24) throw new ValidationError("Token expired");

	const tokenMatch = await compare(token.value, user.password_recovery_token);
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
			password_recovery_token: hashedTokenValue,
			password_recovery_sent_at: new Date()
		})
		.eq("id", user.id);

	return encrypt(JSON.stringify(tokenObject));
}

async function parseToken(encryptedToken) {
	try {
		const decryptedToken = decrypt(encryptedToken);
		const token = JSON.parse(decryptedToken);
		return await tokenSchema.validate(token);
	} catch {
		throw new ValidationError("Invalid token");
	}
}
