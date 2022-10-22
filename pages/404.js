import Link from "next/link";
import { Title, Text, Button, Container, Group } from "@mantine/core";
import { useStyles } from "../styles/404.styles";

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

			<Link href="/" passHref>
				<Button component="a" variant="subtle" size="md">
					Take me back to home page
				</Button>
			</Link>
		</Container>
	);
}
