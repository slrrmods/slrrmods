import { useLocalStorage } from "@mantine/hooks";
import { THEME_STORAGE_KEY, DEFAULT_THEME } from "./constants";

export const tryGetItem = (key) => {
	if (typeof window !== "undefined")
		return JSON.parse(localStorage.getItem(key));
	return null;
};

export const getTheme = () => tryGetItem(THEME_STORAGE_KEY) || DEFAULT_THEME;

export const useThemeStorage = (defaultValue) =>
	useLocalStorage({
		key: THEME_STORAGE_KEY,
		defaultValue: defaultValue || THEME_STORAGE_KEY,
	});
