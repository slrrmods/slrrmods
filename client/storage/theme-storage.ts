import { DEFAULT_THEME, THEME_STORAGE_KEY } from "@client/utils";
import { ColorScheme } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

export function useThemeStorage(defaultValue: ColorScheme) {
	return useLocalStorage({
		key: THEME_STORAGE_KEY,
		defaultValue: defaultValue || DEFAULT_THEME,
	});
}

export const themeStorage = {
	useThemeStorage,
};
