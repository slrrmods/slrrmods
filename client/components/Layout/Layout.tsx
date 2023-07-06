import { Footer, Header, Heads, LayoutContent } from "@/client/components";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Analytics } from "@vercel/analytics/react";
import NextTopLoader from "nextjs-toploader";
import { useStyles } from "./Layout.styles";

type LayoutProps = {
	children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
	const { classes } = useStyles();

	return (
		<>
			<div className={classes.root}>
				<Heads />

				<Header />

				<LayoutContent className={classes.content}>{children}</LayoutContent>

				<Footer />

				<ReactQueryDevtools initialIsOpen={false} />
			</div>

			<NextTopLoader
				color="#7AB9F0"
				shadow="0 0 10px #2299DD,0 0 5px #7AB9F0"
			/>

			<Analytics />
		</>
	);
}
