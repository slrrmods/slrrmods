import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import { setCookie } from "cookies-next";
import { useEffect } from "react";
import { ThemeContext } from ".";
import { THEME_KEY } from "../../utils/constants";
import { useThemeStorage } from "../../utils/local-storage";

export default function ThemeContextProvider({ children, currentTheme }) {
	const [theme, setTheme] = useThemeStorage(currentTheme);

	useEffect(() => {
		setCookie(THEME_KEY, theme, {
			maxAge: 60 * 60 * 24 * 30
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
		toggleTheme
	};

	return (
		<ThemeContext.Provider value={context}>
			<ColorSchemeProvider colorScheme={theme} toggleColorScheme={toggleTheme}>
				<MantineProvider
					theme={{ colorScheme: theme }}
					withGlobalStyles
					withNormalizeCSS>
					<Notifications />

					{children}
				</MantineProvider>
			</ColorSchemeProvider>
		</ThemeContext.Provider>
	);
}
