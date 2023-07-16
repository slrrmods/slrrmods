import {
	Logo,
	NavBar,
	SearchBar,
	ThemeToggle,
	UserPanel,
} from "@client/components";
import { Container, Flex, Group, Stack } from "@mantine/core";
import { useStyles } from "./Header.styles";

export function Header() {
	const { classes } = useStyles();

	return (
		<header className={classes.header}>
			<Container size="xl">
				<Stack spacing="xs" mt="sm">
					<Group position="apart">
						<Logo />

						<SearchBar />

						<Flex justify="flex-end">
							<UserPanel />
						</Flex>
					</Group>

					<Group position="apart">
						<NavBar />

						<ThemeToggle />
					</Group>
				</Stack>
			</Container>
		</header>
	);
}
