import { useEffect } from "react";
import { useHotkeys } from "@mantine/hooks";
import { setCookie } from "cookies-next";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { useThemeStorage } from "../../utils/local-storage";
import { THEME_COOKIE_KEY } from "../../utils/constants";
import { ThemeContext } from ".";

export default function ThemeContextProvider({ children, preferredTheme }) {
	const [theme, setTheme] = useThemeStorage(preferredTheme);

	useEffect(() => {
		setCookie(THEME_COOKIE_KEY, theme, {
			maxAge: 60 * 60 * 24 * 30,
		});
	}, [theme]);

	function toggleTheme() {
		const nextTheme = theme === "dark" ? "light" : "dark";
		setTheme(nextTheme);
	}

	useHotkeys([["mod+J", toggleTheme]]);

	const context = {
		availableThemes: ["light", "dark"],
		isLight: theme === "light",
		isDark: theme === "dark",
		theme,
		toggleTheme,
	};

	return (
		<ThemeContext.Provider value={context}>
			<ColorSchemeProvider colorScheme={theme} toggleColorScheme={toggleTheme}>
				<MantineProvider
					theme={{ colorScheme: theme }}
					withGlobalStyles
					withNormalizeCSS>
					<NotificationsProvider>{children}</NotificationsProvider>
				</MantineProvider>
			</ColorSchemeProvider>
		</ThemeContext.Provider>
	);
}
