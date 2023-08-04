export const IS_DEV_ENV = process.env.NODE_ENV === "development";

export const SESSION_COOKIE_KEY = IS_DEV_ENV
	? "access-token"
	: "__Host-access-token";

export const ENV_URL = IS_DEV_ENV
	? "http://localhost:3000"
	: `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;

export const REQUEST_HEADER_KEY = "x-request-id";
export const CLIENT_HEADER_KEY = "x-client-id";
