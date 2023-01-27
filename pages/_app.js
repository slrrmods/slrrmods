import { Analytics } from "@vercel/analytics/react";
import Head from "next/head";
import App from "next/app";
import { getCookie } from "cookies-next";
import { THEME_COOKIE_KEY, DEFAULT_THEME } from "../utils/constants";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "../contexts/ThemeContext";
import Layout from "../components/Layout";

const queryClient = new QueryClient();
export default function MyApp({ Component, pageProps, colorScheme }) {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider preferredTheme={colorScheme}>
				<Head>
					<title>SLRR Mods</title>

					<meta
						name="viewport"
						content="minimum-scale=1, initial-scale=1, width=device-width"
					/>

					<link rel="shortcut icon" href="/favicon.ico" />
				</Head>

				<Layout>
					<Component {...pageProps} />
					<Analytics />
				</Layout>

				<ReactQueryDevtools initialIsOpen={false} />
			</ThemeProvider>
		</QueryClientProvider>
	);
}

MyApp.getInitialProps = async (appContext) => {
	const initialProps = await App.getInitialProps(appContext);

	const colorScheme =
		getCookie(THEME_COOKIE_KEY, appContext.ctx) || DEFAULT_THEME;

	return {
		...initialProps,
		colorScheme,
	};
};
