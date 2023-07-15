import { Layout } from "@client/components";
import { ContextProvider, ContextProviderProps } from "@client/contexts";
import { getInitialProps } from "@server/data-fetching";
import { AppProps } from "next/app";

export default function SlrrMods(props: AppProps & ContextProviderProps) {
	const { Component, pageProps, currentTheme } = props;

	return (
		<ContextProvider currentTheme={currentTheme}>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</ContextProvider>
	);
}

SlrrMods.getInitialProps = getInitialProps;

export { reportWebVitals } from "next-axiom";
