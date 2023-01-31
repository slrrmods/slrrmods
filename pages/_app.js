import Head from "next/head";
import App from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { getCookie } from "cookies-next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { UserProvider } from "../contexts/UserContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import { THEME_COOKIE_KEY, USER_COOKIE_KEY } from "../utils/constants";
import Layout from "../components/Layout";

const queryClient = new QueryClient();

export default function MyApp({
	Component,
	pageProps,
	currentTheme,
	currentUser,
}) {
	return (
		<QueryClientProvider client={queryClient}>
			<UserProvider currentUser={currentUser}>
				<ThemeProvider currentTheme={currentTheme}>
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
			</UserProvider>
		</QueryClientProvider>
	);
}

MyApp.getInitialProps = async (appContext) => {
	const initialProps = await App.getInitialProps(appContext);

	const currentTheme = getCookie(THEME_COOKIE_KEY, appContext.ctx);
	const userCookie = getCookie(USER_COOKIE_KEY, appContext.ctx);
	const currentUser = userCookie ? JSON.parse(userCookie) : undefined;

	return {
		...initialProps,
		currentTheme,
		currentUser,
	};
};

export { reportWebVitals } from "next-axiom";
