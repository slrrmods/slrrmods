import { Flex, Group } from "@mantine/core";
import Logo from "../../Logo";
import Searchbar from "./Searchbar";
import UserPanel from "./UserPanel";

export default function Headerbar() {
	return (
		<Group grow>
			<Logo />

			<Searchbar />

			<Flex gap="md" justify="flex-end">
				<UserPanel />
			</Flex>
		</Group>
	);
}
