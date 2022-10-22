import { useState } from "react";
import { useStyles } from "./Searchbar.styles";
import { useRouter } from "next/router";
import { getHotkeyHandler } from "@mantine/hooks";
import { TextInput, ActionIcon } from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons";

export default function Searchbar() {
	const [searchTerm, setSearchTerm] = useState("");
	const { classes } = useStyles();
	const router = useRouter();

	const clearSearch = () => setSearchTerm("");

	const search = () => {
		if (searchTerm)
			router.push({ pathname: "/search", query: { term: searchTerm } });
	};

	const shortcutsHandler = getHotkeyHandler([
		["Escape", clearSearch],
		["Enter", search],
	]);

	return (
		<TextInput
			classNames={classes}
			placeholder="Search"
			radius="xm"
			value={searchTerm}
			onChange={(e) => setSearchTerm(e.target.value)}
			onKeyDown={shortcutsHandler}
			rightSection={
				<>
					{searchTerm && (
						<ActionIcon variant="transparent" onClick={() => clearSearch()}>
							<IconX size={16} />
						</ActionIcon>
					)}

					<ActionIcon variant="transparent" onClick={() => search()}>
						<IconSearch size={20} />
					</ActionIcon>
				</>
			}
		/>
	);
}
