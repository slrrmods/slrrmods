import { Group } from "@mantine/core";
import Logo from "../../Logo";
import Searchbar from "./Searchbar";
import UserPanel from "./UserPanel";

export default function Headerbar() {
	return (
		<Group position="apart">
			<Logo />

			<Searchbar />

			<UserPanel />
		</Group>
	);
}
