import Link from "next/link";
import {
	Footer as MantineFooter,
	Container,
	Group,
	ActionIcon,
	Stack,
	Divider,
	Text,
} from "@mantine/core";
import Logo from "../Logo";
import { IconBrandGithub } from "@tabler/icons";

export default function Footer() {
	return (
		<MantineFooter py={8}>
			<Container size="lg">
				<Stack>
					<Group position="apart">
						<Logo />

						<Link href="https://github.com/adnan-54/slrrmods" passHref>
							<ActionIcon component="a" size="lg">
								<IconBrandGithub stroke={1.5} />
							</ActionIcon>
						</Link>
					</Group>

					<Divider />

					<Text size="sm" color="dimmed" align="center">
						© Copyright adnan54 {new Date().getFullYear()}
					</Text>
				</Stack>
			</Container>
		</MantineFooter>
	);
}
