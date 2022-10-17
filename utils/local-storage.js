import { useLocalStorage } from "@mantine/hooks";
import { CONSTANTS } from ".";

export const tryGetItem = (key) => {
	if (typeof window !== "undefined")
		return JSON.parse(localStorage.getItem(key));
	return null;
};

export const getTheme = () =>
	tryGetItem(CONSTANTS.THEME_STORAGE_KEY) || CONSTANTS.DEFAULT_THEME;

export const useThemeStorage = (defaultValue) =>
	useLocalStorage({
		key: CONSTANTS.THEME_STORAGE_KEY,
		defaultValue: defaultValue || CONSTANTS.THEME_STORAGE_KEY,
	});
