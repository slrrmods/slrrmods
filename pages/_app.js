import React, { useEffect } from "react";
import Head from "next/head";
import CssBaseline from "@material-ui/core/CssBaseline";

import { ThemeProvider } from "@material-ui/core/styles";
import { UserProvider } from "../contexts/UserContext";
import { DrawerProvider } from "../contexts/DrawerContext";

import theme from "../styles/themes";

export default function MyApp({ Component, pageProps }) {
	useEffect(() => {
		const jssStyles = document.querySelector("#jss-server-side");

		if (jssStyles) jssStyles.parentElement.removeChild(jssStyles);
	}, []);

	return (
		<>
			<Head>
				<title>SLRR Mods</title>
				<link rel="icon" href="/favicon.ico" />
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>
			</Head>

			<UserProvider>
				<DrawerProvider>
					<ThemeProvider theme={theme}>
						<CssBaseline />
						<Component {...pageProps} />
					</ThemeProvider>
				</DrawerProvider>
			</UserProvider>
		</>
	);
}
