import { Link, Logo } from "@/client/components";
import {
	ActionIcon,
	Container,
	Divider,
	Group,
	Stack,
	Text,
	Tooltip,
} from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons-react";

export function Footer() {
	return (
		<footer>
			<Container size="lg" py="xs">
				<Stack spacing="xs">
					<Group position="apart">
						<Logo />

						<Tooltip
							openDelay={500}
							transitionProps={{
								transition: "fade",
								duration: 300,
							}}
							label="Source code">
							<Link href="https://github.com/slrrmods/slrrmods" newTab>
								<ActionIcon>
									<IconBrandGithub />
								</ActionIcon>
							</Link>
						</Tooltip>
					</Group>

					<Divider />

					<Text size="sm" color="dimmed" align="center">
						© Copyright adnan54 {new Date().getFullYear()}
					</Text>
				</Stack>
			</Container>
		</footer>
	);
}
