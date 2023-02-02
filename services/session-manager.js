import * as yup from "yup";
import geoip from "geoip-lite";
import { hash, compare } from "bcrypt";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
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

export async function getCurrentSession(request, response) {
	const token = await getFromCookies(request, response);
	if (!token) return undefined;

	const { data } = await client
		.from("sessions")
		.select()
		.eq("id", token.session)
		.maybeSingle();

	return data;
}

export async function validateSession(session, request, response) {
	try {
		if (!session) throw new ValidationError("Invalid session", 401);
		if (!session.token) throw new ValidationError("Invalid session", 401);

		if (session.revoked_at) throw new ValidationError("Session revoked", 401);

		if (new Date() > new Date(session.expires_at))
			throw new ValidationError("Session expired", 401);

		const token = await getFromCookies(request, response);

		const tokenMatches = await compare(token.value, session.token);
		if (!tokenMatches) throw new ValidationError("Invalid session", 401);

		if (token.session !== session.id)
			throw new ValidationError("Invalid session", 401);

		await client
			.from("sessions")
			.update({ updated_at: new Date() })
			.eq("id", session.id);
	} catch (error) {
		await quitSession(session, request, response);
		throw error;
	}
}

export async function joinNewSession(
	username,
	password,
	sso,
	request,
	response,
	currentSession
) {
	if (currentSession) await quitSession(currentSession, request, response);

	const user = await getFromLogin(username, password);
	const { session, token } = await createSession(user, sso, request);
	writeToCookies(session, token, request, response);
}

export async function quitSession(session, request, response) {
	try {
		await revokeSession(session);
	} catch {
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
