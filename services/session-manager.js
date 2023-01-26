import * as yup from "yup";
import geoip from "geoip-lite";
import { hash, compare } from "bcrypt";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { createClient } from "./supabase-client";
import { createRandomToken } from "../utils/tokenizer";
import { encrypt, decrypt } from "../utils/crypto";
import { SESSION_COOKIE_KEY, IS_DEVELOPMENT_ENV } from "../utils/constants";

const tokenSchema = yup.object().shape({
	session: yup.string().required(),
	value: yup.string().required(),
});

const client = createClient();

export async function joinNewSession(user, sso, request, response) {
	await quitCurrentSession(request, response);

	const { session, token } = await createSession(user, sso, request);
	writeToCookies(session, token, request, response);
}

export async function quitCurrentSession(request, response) {
	try {
		const token = await getFromCookies(request, response);
		if (!token) return;

		const { data: session } = await client
			.from("sessions")
			.select()
			.eq("id", token.session)
			.maybeSingle();

		if (!session) throw new Error("Invalid session");

		const tokenMatch = await compare(token.value, session.token);
		if (!tokenMatch) throw new Error("Invalid session");

		await revokeSession(session);
	} catch (error) {
		throw error;
	} finally {
		removeFromCookies(request, response);
	}
}

export async function revokeSession(session) {
	if (session.revokedAt) throw new Error("Session already revoked");

	await client
		.from("sessions")
		.update({ revoked_at: new Date() })
		.eq("id", session.id);
}

async function createSession(user, sso, request) {
	const expiresAt = new Date();
	if (sso) expiresAt.setDate(expiresAt.getDate() + 7);
	else expiresAt.setHours(expiresAt.getHours() + 12);

	const ip =
		request.headers["x-forwarded-for"] || request.connection.remoteAddress;

	const geo = geoip.lookup(ip);
	const city = geo ? geo.city : "Unknown";
	const country = geo ? geo.country : "Unknown";
	const location = `${city}, ${country}`;

	const { data: session } = await client
		.from("sessions")
		.insert({
			owner: user.id,
			expires_at: expiresAt,
			ip,
			location,
			sso,
		})
		.select()
		.single();

	const token = await createToken(session);

	return { session, token };
}

async function getFromCookies(request, response) {
	const cookie = getCookie(SESSION_COOKIE_KEY, { req: request, res: response });
	if (cookie) return await parseToken(cookie);
	return undefined;
}

function writeToCookies(session, token, request, response) {
	setCookie(SESSION_COOKIE_KEY, token, {
		req: request,
		res: response,
		httpOnly: true,
		secure: !IS_DEVELOPMENT_ENV,
		sameSite: "strict",
		expires: session.sso ? session.expiresAt : undefined,
		path: "/",
	});
}

function removeFromCookies(request, response) {
	deleteCookie(SESSION_COOKIE_KEY, {
		req: request,
		res: response,
		path: "/",
	});
}

async function createToken(session) {
	const tokenObject = {
		session: session.id,
		value: createRandomToken(),
	};

	const hashedTokenValue = await hash(tokenObject.value, 10);
	await client
		.from("sessions")
		.update({
			token: hashedTokenValue,
		})
		.eq("id", session.id);

	return encrypt(JSON.stringify(tokenObject));
}

async function parseToken(encryptedToken) {
	try {
		const descryptedToken = decrypt(encryptedToken);
		const parsedToken = JSON.parse(descryptedToken);
		return await tokenSchema.validate(parsedToken);
	} catch {
		throw new Error("Invalid token");
	}
}
