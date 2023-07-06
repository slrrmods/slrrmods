import { Footer, Header, Heads, LayoutContent } from "@/client/components";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Analytics } from "@vercel/analytics/react";
import { useStyles } from "./Layout.styles";

type LayoutProps = {
	children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
	const { classes } = useStyles();

	return (
		<div className={classes.root}>
			<Heads />

			<Header />

			<LayoutContent className={classes.content}>{children}</LayoutContent>

			<Footer />

			<Analytics />

			<ReactQueryDevtools initialIsOpen={false} />
		</div>
	);
}
