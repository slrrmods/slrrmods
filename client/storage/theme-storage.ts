import {
	DEFAULT_THEME,
	THEME_COOKIE_KEY,
	THEME_STORAGE_KEY,
} from "@client/utils";
import { ColorScheme } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { setCookie } from "cookies-next";
import { useEffect } from "react";

export function useThemeStorage(defaultValue: ColorScheme) {
	const [theme, setTheme, removeTheme] = useLocalStorage({
		key: THEME_STORAGE_KEY,
		defaultValue: defaultValue || DEFAULT_THEME,
	});

	useEffect(() => {
		setCookie(THEME_COOKIE_KEY, theme, {
			maxAge: 60 * 60 * 24 * 30, // 30 days
		});
	}, [theme]);

	return { theme, setTheme, removeTheme };
}

export const themeStorage = {
	useThemeStorage,
};
