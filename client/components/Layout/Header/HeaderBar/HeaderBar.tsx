import { Logo, SearchBar, UserPanel } from "@/client/components";
import { Flex, Group } from "@mantine/core";

export function HeaderBar() {
	return (
		<Group py="xs" position="apart">
			<Logo />

			<SearchBar />

			<Flex justify="flex-end">
				<UserPanel />
			</Flex>
		</Group>
	);
}
