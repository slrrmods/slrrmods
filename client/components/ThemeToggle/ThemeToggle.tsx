import { ActionIcon, Tooltip } from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons-react";

export function ThemeToggle() {
	const isDark = false;

	function toggleTheme() {}

	return (
		<Tooltip
			position="bottom"
			openDelay={500}
			transitionProps={{
				transition: "fade",
				duration: 300,
			}}
			label={isDark ? "Light mode" : "Dark mode"}>
			<ActionIcon
				mb={1}
				size="lg"
				variant="filled"
				color="blue"
				onClick={toggleTheme}>
				{isDark ? <IconSun /> : <IconMoonStars />}
			</ActionIcon>
		</Tooltip>
	);
}
