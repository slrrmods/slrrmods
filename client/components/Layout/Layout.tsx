import {
	Footer,
	Header,
	Heads,
	LayoutContent,
	ScrollToTop,
} from "@client/components";
import { Notifications } from "@mantine/notifications";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Analytics } from "@vercel/analytics/react";
import NextTopLoader from "nextjs-toploader";
import { useStyles } from "./Layout.styles";

export type LayoutProps = {
	children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
	const { classes } = useStyles();

	return (
		<div className={classes.root}>
			<NextTopLoader color="#FFFFFF7F" />

			<Heads />

			<Header />

			<LayoutContent className={classes.content}>{children}</LayoutContent>

			<Footer />

			<ScrollToTop />

			<Notifications />

			<ReactQueryDevtools initialIsOpen={false} />

			<Analytics />
		</div>
	);
}
