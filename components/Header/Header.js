import { useStyles } from "./Header.styles";
import Link from "next/link";
import { Header as MantineHeader, Title, Button } from "@mantine/core";

export default function Header() {
	const { classes } = useStyles();

	return (
		<MantineHeader className={classes.root}>
			<Link href="/" passHref>
				<Title className={classes.logo} order={4} component="a">
					SLRR MODS
				</Title>
			</Link>

			<Button.Group>
				<Link href="/news" passHref>
					<Button className={classes.menuButton} variant="subtle" component="a">
						News
					</Button>
				</Link>

				<Link href="/downloads" passHref>
					<Button className={classes.menuButton} variant="subtle" component="a">
						Downloads
					</Button>
				</Link>

				<Link href="/forum" passHref>
					<Button className={classes.menuButton} variant="subtle" component="a">
						Forum
					</Button>
				</Link>

				<Link href="/roleplay" passHref>
					<Button className={classes.menuButton} variant="subtle" component="a">
						Roleplay
					</Button>
				</Link>
			</Button.Group>

			<Button.Group>
				<Link href="/user/SignIn" passHref>
					<Button variant="outline" component="a">
						Sign In
					</Button>
				</Link>

				<Link href="/user/SignUp" passHref>
					<Button variant="outline" component="a">
						Sign Up
					</Button>
				</Link>
			</Button.Group>
		</MantineHeader>
	);
}
