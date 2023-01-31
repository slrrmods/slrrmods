import { Title, Text, Button, Container, createStyles } from "@mantine/core";
import Link from "../components/Link";
import * as themeHelpers from "../utils/theme-helpers";

const useStyles = createStyles((theme) => ({
	root: {
		margin: "auto",
		display: "flex",
		flexDirection: "column",
		placeItems: "center",
		gap: theme.spacing.xl,
	},

	label: {
		lineHeight: "1",
		fontWeight: 900,
		fontSize: 220,
		color: themeHelpers.getFromConditional(
			theme,
			theme.colors.dark[4],
			theme.colors.gray[2]
		),
	},

	title: {
		fontWeight: 900,
		fontSize: 38,
	},

	description: {
		maxWidth: 500,
		textAlign: "center",
	},
}));

export default function NotFound() {
	const { classes } = useStyles();

	return (
		<Container className={classes.root}>
			<div className={classes.label}>404</div>

			<Title className={classes.title}>You have found a secret place.</Title>

			<Text className={classes.description} color="dimmed" size="lg">
				Unfortunately, this is only a 404 page. You may have mistyped the
				address, or the page has been moved to another URL.
			</Text>

			<Link href="/">
				<Button variant="subtle" size="md">
					Take me back to home page
				</Button>
			</Link>
		</Container>
	);
}
