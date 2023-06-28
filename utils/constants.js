export const IS_DEVELOPMENT_ENV = process.env.NODE_ENV === "development";
export const IS_SERVER_ENV = typeof window === "undefined";

export const DEFAULT_THEME = "light";
export const THEME_KEY = "app-theme";
export const USER_KEY = "user";
export const REFRESH_TOKEN_KEY = "refresh-token";

export const SESSION_COOKIE_KEY = IS_DEVELOPMENT_ENV
	? "access-token"
	: "__Host-access-token";

export const ENVIROMENT_URL = IS_DEVELOPMENT_ENV
	? "http://localhost:3000"
	: `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
