import { useLocalStorage } from "@mantine/hooks";
import { THEME_COOKIE_KEY, DEFAULT_THEME } from "./constants";

export const tryGetItem = (key) => {
	if (IS_IN_SERVER_ENV) return null;
	return JSON.parse(localStorage.getItem(key));
};

export const getTheme = () => tryGetItem(THEME_COOKIE_KEY) || DEFAULT_THEME;

export const useThemeStorage = (defaultValue) =>
	useLocalStorage({
		key: THEME_COOKIE_KEY,
		defaultValue: defaultValue || THEME_COOKIE_KEY,
	});
