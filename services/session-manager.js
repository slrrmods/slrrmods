import * as yup from "yup";
import geoip from "geoip-lite";
import { hash, compare } from "bcrypt";
import { setCookie, getCookie, deleteCookie, hasCookie } from "cookies-next";
import { createClient } from "./supabase-client";
import { createRandomToken } from "../utils/tokenizer";
import { encrypt, decrypt } from "../utils/crypto";
import { SESSION_COOKIE_KEY, IS_DEVELOPMENT_ENV } from "../utils/constants";
import { getIp } from "../utils/ip";
import { getFromLogin } from "./user-service";
import { ValidationError } from "../classes";

const tokenSchema = yup.object().shape({
	session: yup.string().required(),
	value: yup.string().required(),
});

const client = createClient();

export async function validateCurrentSession(request, response) {
	if (!containsSession(request, response)) return undefined;

	const session = await getCurrentSession(request, response);

	if (session.revoked_at) {
		await quitSession(session, request, response);
		throw new ValidationError("Session revoked", 401);
	}

	if (new Date() > new Date(session.expires_at)) {
		await quitSession(session, request, response);
		throw new ValidationError("Session expired", 401);
	}

	await client
		.from("sessions")
		.update({ updated_at: new Date() })
		.eq("id", session.id);

	return session;
}

export async function joinNewSession(
	username,
	password,
	sso,
	request,
	response,
	currentSession
) {
	try {
		await quitSession(currentSession, request, response);
	} catch {}

	const user = await getFromLogin(username, password);
	const { session, token } = await createSession(user, sso, request);
	writeToCookies(session, token, request, response);
}

export async function quitSession(session, request, response) {
	try {
		await revokeSession(session);
	} finally {
		removeFromCookies(request, response);
	}
}

export async function revokeSession(session) {
	if (session.revoked_at) throw new ValidationError("Session already revoked");

	await client
		.from("sessions")
		.update({
			revoked_at: new Date(),
			token: null,
		})
		.eq("id", session.id);
}

export async function revokeAllSessions(user) {
	await client
		.from("sessions")
		.update({
			revoked_at: new Date(),
			token: null,
		})
		.eq("owner", user.id)
		.is("revoked_at", null);
}

async function getCurrentSession(request, response) {
	try {
		const token = await getFromCookies(request, response);
		if (!token) throw new ValidationError("User not logged in");

		const { data } = await client
			.from("sessions")
			.select()
			.eq("id", token.session)
			.maybeSingle();

		if (!data) throw new ValidationError("Invalid session", 401);
		if (!data.token) throw new ValidationError("Invalid session", 401);

		const tokenMatches = await compare(token.value, data.token);
		if (!tokenMatches) throw new ValidationError("Invalid session", 401);

		return data;
	} catch (error) {
		removeFromCookies(request, response);
		throw error;
	}
}

async function createSession(user, sso, request) {
	const expiresAt = new Date();
	if (sso) expiresAt.setDate(expiresAt.getDate() + 7);
	else expiresAt.setHours(expiresAt.getHours() + 12);

	const ip = getIp(request);

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

function containsSession(request, response) {
	return hasCookie(SESSION_COOKIE_KEY, { req: request, res: response });
}

function writeToCookies(session, token, request, response) {
	setCookie(SESSION_COOKIE_KEY, token, {
		req: request,
		res: response,
		httpOnly: true,
		secure: !IS_DEVELOPMENT_ENV,
		sameSite: "strict",
		expires: session.sso ? new Date(session.expires_at) : undefined,
		path: "/",
	});
}

function removeFromCookies(request, response) {
	deleteCookie(SESSION_COOKIE_KEY, {
		req: request,
		res: response,
		httpOnly: true,
		secure: !IS_DEVELOPMENT_ENV,
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
		throw new ValidationError("Invalid token");
	}
}
