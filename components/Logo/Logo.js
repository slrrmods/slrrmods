import { Title } from "@mantine/core";
import Link from "next/link";

export default function Logo() {
	return (
		<Link href="/" passHref>
			<Title order={3} component="a">
				SLRR MODS
			</Title>
		</Link>
	);
}
