import { compare, hash } from "bcrypt";
import * as yup from "yup";
import { ValidationError } from "../classes";
import { createClient } from "../services/supabase-client";
import { decrypt, encrypt } from "../utils/crypto";
import { createRandomToken } from "../utils/tokenizer";

const tokenSchema = yup.object().shape({
	refreshToken: yup.string().required(),
	value: yup.string().required(),
});

const client = createClient();

export async function refreshSession(encryptedToken, session) {
	await validateSession(session);

	const token = await parseToken(encryptedToken);
	const refreshToken = await getRefreshToken(token);

	await validateRefreshToken(refreshToken, session);
	await revokeAll(session);
	await consumeToken(refreshToken);

	const expireDate = new Date();
	expireDate.setDate(expireDate.getDate() + 7);

	await client
		.from("sessions")
		.update({ expires_at: expireDate })
		.eq("id", session.id);

	return await createToken(refreshToken);
}

export async function createNew(session) {
	await revokeAll(session);
	await validateSession(session);

	const { data } = await client
		.from("refresh_tokens")
		.insert({
			session: session.id,
			token: "",
		})
		.select()
		.single();

	return await createToken(data);
}

export async function revokeAll(session) {
	await client
		.from("refresh_tokens")
		.update({ revoked_at: new Date() })
		.eq("session", session.id)
		.is("revoked_at", null);
}

async function validateSession(session) {
	if (session.revoked_at) throw new ValidationError("Invalid session", 401);

	if (session.expires_at && new Date() > new Date(session.expires_at))
		throw new ValidationError("Invalid session", 401);

	if (!session.sso) throw new ValidationError("Invalid session", 401);
}

async function validateRefreshToken(refreshToken, session) {
	if (refreshToken.session !== session.id)
		throw new ValidationError("Invalid token", 401);

	if (refreshToken.revoked_at) throw new ValidationError("Invalid token", 401);

	if (refreshToken.used_at) throw new ValidationError("Invalid token", 401);

	const expiresAt = new Date(refreshToken.created_at);
	expiresAt.setDate(expiresAt.getDate() + 7);
	if (new Date() > expiresAt) throw new ValidationError("Invalid token", 401);
}

async function consumeToken(refreshToken) {
	await client
		.from("refresh_tokens")
		.update({ used_at: new Date() })
		.eq("id", refreshToken.id);
}

async function getRefreshToken(token) {
	const { data } = await client
		.from("refresh_tokens")
		.select()
		.eq("id", token.refreshToken)
		.single();

	const tokenMatch = await compare(token.value, data.token);
	if (!tokenMatch) throw new ValidationError("Invalid token", 401);

	return data;
}

async function createToken(refreshToken) {
	const tokenObject = {
		refreshToken: refreshToken.id,
		value: createRandomToken(),
	};

	const hashedTokenValue = await hash(tokenObject.value, 10);
	await client
		.from("refresh_tokens")
		.update({
			token: hashedTokenValue,
		})
		.eq("id", refreshToken.id);

	return encrypt(JSON.stringify(tokenObject));
}

async function parseToken(encryptedToken) {
	try {
		const decryptedToken = decrypt(encryptedToken);
		const parsedToken = JSON.parse(decryptedToken);
		return await tokenSchema.validate(parsedToken);
	} catch {
		throw new ValidationError("Invalid token", 401);
	}
}
