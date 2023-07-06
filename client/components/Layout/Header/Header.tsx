import { HeaderBar, NavBar } from "@/client/components";
import { Container } from "@mantine/core";

export function Header() {
	return (
		<header>
			<Container size="xl">
				<HeaderBar />
				<NavBar />
			</Container>
		</header>
	);
}
