import { HeaderBar, NavBar } from "@/client/components";
import { Container } from "@mantine/core";
import { useStyles } from "./Header.styles";

export function Header() {
	const { classes } = useStyles();

	return (
		<header className={classes.header}>
			<Container size="xl">
				<HeaderBar />

				<NavBar />
			</Container>
		</header>
	);
}
