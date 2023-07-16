import { Link } from "@client/components";
import {
	Button,
	Center,
	Stack,
	Text,
	Title,
	useMantineTheme,
} from "@mantine/core";

export default function NotFound() {
	const theme = useMantineTheme();

	return (
		<Center>
			<Stack align="center" spacing="xl">
				<Title
					order={1}
					size="14rem"
					weight={900}
					lh={1}
					color={theme.colorScheme === "dark" ? "dark.5" : "gray.3"}>
					404
				</Title>

				<Title order={2} size="2.5rem" weight={900} lh={1}>
					You have found a secret place.
				</Title>

				<Text maw={500} color="dimmed" size="lg" align="center">
					Unfortunately, this is only a 404 page. You may have mistyped the
					address, or the page has been moved to another URL.
				</Text>

				<Link href="/">
					<Button variant="subtle" size="md">
						Take me back to home page
					</Button>
				</Link>
			</Stack>
		</Center>
	);
}
