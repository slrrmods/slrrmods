import Head from "next/head";
import Layout from "../components/Layout";
import { getCookie } from "cookies-next";
import { CONSTANTS } from "../utils";
import { ThemeProvider } from "../contexts/ThemeContext";

export default function App({ Component, pageProps, colorScheme }) {
	return (
		<>
			<Head>
				<title>SLRR Mods</title>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>
				<link rel="shortcut icon" href="/favicon.svg" />
			</Head>

			<ThemeProvider preferredTheme={colorScheme}>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</ThemeProvider>
		</>
	);
}

App.getInitialProps = ({ ctx }) => ({
	colorScheme:
		getCookie(CONSTANTS.THEME_STORAGE_KEY, ctx) || CONSTANTS.DEFAULT_THEME,
});
