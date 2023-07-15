import { Layout } from "@client/components";
import { ContextProvider } from "@client/contexts";
import { AppProps } from "next/app";

export default function App(props: AppProps) {
	const { Component, pageProps } = props;

	return (
		<ContextProvider currentTheme="light">
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</ContextProvider>
	);
}

export { reportWebVitals } from "next-axiom";
