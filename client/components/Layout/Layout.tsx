import { Footer, Header, Heads, LayoutContent } from "@client/components";
import { Notifications } from "@mantine/notifications";
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
		<div className={classes.root}>
			<NextTopLoader color="white" shadow="0 0 10px #000,0 0 5px #000" />
			<Heads />

			<Header />

			<LayoutContent className={classes.content}>{children}</LayoutContent>

			<Footer />

			<Notifications />

			<ReactQueryDevtools initialIsOpen={false} />

			<Analytics />
		</div>
	);
}
