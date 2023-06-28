import { useLocalStorage } from "@mantine/hooks";
import { THEME_KEY, DEFAULT_THEME } from "./constants";

export const tryGetItem = (key) => {
	if (IS_IN_SERVER_ENV) return null;
	return JSON.parse(localStorage.getItem(key));
};

export function getTheme() {
	return tryGetItem(THEME_KEY) || DEFAULT_THEME;
}

export function useThemeStorage(defaultValue) {
	return useLocalStorage({
		key: THEME_KEY,
		defaultValue: defaultValue || DEFAULT_THEME,
	});
}
