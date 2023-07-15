import { useThemeStorage } from "@client/storage";
import {
	ColorScheme,
	ColorSchemeProvider,
	MantineProvider,
} from "@mantine/core";
import { createContext, useContext } from "react";

export type ThemeProviderProps = {
	children: React.ReactNode;
	currentTheme: ColorScheme;
};

type ThemeContextProps = {
	theme: ColorScheme;
	toggleTheme: () => void;
	isLight: boolean;
	isDark: boolean;
};

const DEFAULT_CONTEXT: ThemeContextProps = {
	theme: "light",
	toggleTheme: () => {},
	isLight: true,
	isDark: false,
};

const ThemeContext = createContext<ThemeContextProps>(DEFAULT_CONTEXT);

export function useThemeContext() {
	return useContext(ThemeContext);
}

export function ThemeProvider(props: ThemeProviderProps) {
	const { children, currentTheme } = props;

	const [theme, setTheme] = useThemeStorage(currentTheme);

	function toggleTheme() {
		setTheme(theme === "dark" ? "light" : "dark");
	}

	const context = {
		theme,
		toggleTheme,
		isLight: theme === "light",
		isDark: theme === "dark",
	};

	return (
		<ThemeContext.Provider value={context}>
			<ColorSchemeProvider colorScheme={theme} toggleColorScheme={toggleTheme}>
				<MantineProvider
					withGlobalStyles
					withNormalizeCSS
					theme={{ colorScheme: theme }}>
					{children}
				</MantineProvider>
			</ColorSchemeProvider>
		</ThemeContext.Provider>
	);
}
