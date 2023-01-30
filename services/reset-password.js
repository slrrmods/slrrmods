import * as yup from "yup";
import { hash, compare } from "bcrypt";
import { createClient } from "./supabase-client";
import { getFromId } from "./user-service";
import { sendHtml } from "./email-sender";
import { revokeAllSessions } from "./session-manager";
import { createRandomToken } from "../utils/tokenizer";
import { encrypt, decrypt } from "../utils/crypto";
import { createFromTemplate, EMAIL_TEMPLATES } from "../utils/email-templates";
import { ENVIROMENT_URL } from "../utils/constants";

const tokenSchema = yup.object().shape({
	user: yup.string().required(),
	value: yup.string().required(),
});

const client = createClient();

export async function sendResetPassword(user) {
	const { email, username } = user;
	const token = await createToken(user);

	const html = createFromTemplate(EMAIL_TEMPLATES.RESET_PASSWORD, {
		username,
		tokenUrl: `${ENVIROMENT_URL}/resetPassword?token=${token}`,
		year: new Date().getFullYear(),
	});

	await sendHtml(email, "", html);
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
			password_recovered_at: new Date(),
		})
		.eq("id", user.id);

	const date = new Intl.DateTimeFormat("en", {
		dateStyle: "medium",
		timeStyle: "medium",
	}).format(new Date());

	const html = createFromTemplate(EMAIL_TEMPLATES.RESET_PASSWORD_INFO, {
		username: user.username,
		date,
		resetPasswordUrl: `${ENVIROMENT_URL}/users/forgotPassword`,
		year: new Date().getFullYear(),
	});

	await sendHtml(user.email, "", html);
}

export async function validateToken(encryptedToken) {
	const token = await parseToken(encryptedToken);

	const user = await getFromId(token.user);
	if (!user) throw new Error("Invalid token");
	if (!user.active) throw new Error("User is not active");

	if (!user.password_recovery_token) throw new Error("Password already reset");
	if (!user.password_recovery_sent_at) throw new Error("Token expired");

	const now = new Date();
	const sentAt = new Date(user.password_recovery_sent_at);
	const diff = now.getTime() - sentAt.getTime();
	const diffHours = Math.floor(diff / (1000 * 60 * 60));
	if (diffHours > 24) throw new Error("Token expired");

	const tokenMatch = await compare(token.value, user.password_recovery_token);
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
			password_recovery_token: hashedTokenValue,
			password_recovery_sent_at: new Date(),
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
		throw new Error("Invalid token");
	}
}
