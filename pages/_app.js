import Head from "next/head";
import Layout from "../components/Layout";
import { getCookie } from "cookies-next";
import { CONSTANTS } from "../utils";
import { ThemeProvider } from "../contexts/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

export default function App({ Component, pageProps, colorScheme }) {
	return (
		<>
			<Head>
				<title>SLRR Mods</title>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>
				<link rel="shortcut icon" href="/favicon.ico" />
			</Head>

			<QueryClientProvider client={queryClient}>
				<ThemeProvider preferredTheme={colorScheme}>
					<Layout>
						<Component {...pageProps} />
					</Layout>

					<ReactQueryDevtools initialIsOpen={false} />
				</ThemeProvider>
			</QueryClientProvider>
		</>
	);
}

App.getInitialProps = ({ ctx }) => ({
	colorScheme:
		getCookie(CONSTANTS.THEME_STORAGE_KEY, ctx) || CONSTANTS.DEFAULT_THEME,
});
