import { ActionIcon, TextInput, Tooltip } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useStyles } from "./SearchBar.styles";

export function SearchBar() {
	const router = useRouter();
	const { classes, theme } = useStyles();
	const [search, setSearch] = useState(router.query.term || "");
	const searchRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (router.query.term) {
			setSearch(router.query.term as string);
		} else {
			clearSearch();
		}
	}, [router.query]);

	function clearSearch() {
		setSearch("");
	}

	function handleSearch() {
		if (search.length >= 3) {
			router.push({ pathname: "/search", query: { term: search } });
			return;
		}

		searchRef.current?.focus();
	}

	function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
		setSearch(e.currentTarget.value);
	}

	const shortcutsHandler = getHotkeyHandler([
		["Escape", clearSearch],
		["Enter", handleSearch],
	]);

	const rightSection = (
		<>
			{search.length > 0 && (
				<Tooltip
					openDelay={500}
					transitionProps={{
						transition: "fade",
						duration: 300,
					}}
					label="Clear">
					<ActionIcon variant="transparent" onClick={clearSearch}>
						<IconX size={20} color={theme.colors.gray[4]} />
					</ActionIcon>
				</Tooltip>
			)}

			<Tooltip
				openDelay={500}
				transitionProps={{
					transition: "fade",
					duration: 300,
				}}
				label="Search">
				<ActionIcon variant="transparent" onClick={handleSearch}>
					<IconSearch size={20} color={theme.colors.gray[4]} />
				</ActionIcon>
			</Tooltip>
		</>
	);

	return (
		<TextInput
			ref={searchRef}
			classNames={classes}
			placeholder="Search"
			value={search}
			onChange={onSearchChange}
			onKeyDown={shortcutsHandler}
			rightSection={rightSection}
		/>
	);
}
