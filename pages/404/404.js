import { useStyles } from "./404.styles";
import { Title, Divider, Stack, Text, Anchor } from "@mantine/core";
import Link from "next/link";

export default function NotFound() {
	const { classes } = useStyles();
	return (
		<div className={classes.root}>
			<div className={classes.content}>
				<Title order={1}>404</Title>
				<Divider orientation="vertical" />
				<Stack spacing={"sm"}>
					<Text>This page could not be found.</Text>
					<Link href="/" passHref>
						<Anchor component="a">Go back to home page.</Anchor>
					</Link>
				</Stack>
			</div>
		</div>
	);
}
