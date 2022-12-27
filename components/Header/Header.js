import { useStyles } from "./Header.styles";
import { Container, Stack } from "@mantine/core";
import Headerbar from "../Headerbar";
import Navbar from "../Navbar";

export default function Header() {
	const { classes } = useStyles();

	return (
		<header className={classes.header}>
			<Container size="xl">
				<Stack justify="space-between" spacing="xs">
					<Headerbar />

					<Navbar />
				</Stack>
			</Container>
		</header>
	);
}
