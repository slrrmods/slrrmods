import { Container } from "@mantine/core";
import { useStyles } from "./Layout.styles";
import Header from "../Header";
import Footer from "../Footer";
import Modals from "../Modals";

export default function Layout({ children }) {
	const { classes } = useStyles();

	return (
		<div className={classes.root}>
			<Header />

			<Container className={classes.content} size="xl" px="md" py="md">
				{children}
			</Container>

			<Footer />

			<Modals />
		</div>
	);
}
