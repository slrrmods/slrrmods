export const DEFAULT_THEME = "light";
export const THEME_STORAGE_KEY = "app-theme";
export const ENVIROMENT_URL =
	process.env.NODE_ENV === "development"
		? "http://localhost:3000"
		: `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
