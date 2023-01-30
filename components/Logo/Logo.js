import Link from "next/link";
import { Title } from "@mantine/core";

export default function Logo() {
	return (
		<Link href="/" passHref legacyBehavior>
			<Title order={3} component="a">
				SLRR MODS
			</Title>
		</Link>
	);
}
