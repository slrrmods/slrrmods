import { useState } from "react";
import { useRouter } from "next/router";
import { useStyles } from "./Searchbar.styles";
import { getHotkeyHandler } from "@mantine/hooks";
import { TextInput, ActionIcon, useMantineTheme } from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons";

export default function Searchbar() {
	const [searchTerm, setSearchTerm] = useState("");
	const theme = useMantineTheme();
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
			variant="unstyled"
			value={searchTerm}
			onChange={(e) => setSearchTerm(e.target.value)}
			onKeyDown={shortcutsHandler}
			rightSection={
				<>
					{searchTerm && (
						<ActionIcon variant="transparent" onClick={() => clearSearch()}>
							<IconX size={16} color={theme.colors.gray[2]} />
						</ActionIcon>
					)}

					<ActionIcon variant="transparent" onClick={() => search()}>
						<IconSearch size={20} color={theme.colors.gray[2]} />
					</ActionIcon>
				</>
			}
		/>
	);
}
