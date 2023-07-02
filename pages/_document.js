import { ServerStyles, createStylesServer } from "@mantine/next";
import Document, { Head, Html, Main, NextScript } from "next/document";

const stylesServer = createStylesServer();

export default class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const originalRenderPage = ctx.renderPage;

		ctx.renderPage = () =>
			originalRenderPage({
				enhanceApp: (App) => App,
				enhanceComponent: (Component) => Component
			});

		const initialProps = await Document.getInitialProps(ctx);

		return {
			...initialProps,
			styles: [
				initialProps.styles,
				<ServerStyles
					html={initialProps.html}
					server={stylesServer}
					key="styles"
				/>
			]
		};
	}

	render() {
		return (
			<Html>
				<Head />
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
