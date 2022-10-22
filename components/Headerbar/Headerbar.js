import { Group } from "@mantine/core";
import Logo from "../Logo";
import Searchbar from "../Searchbar/Searchbar";

export default function Headerbar() {
	return (
		<Group position="apart">
			<Logo />

			<Searchbar />
		</Group>
	);
}