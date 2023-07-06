import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => {
	const background = theme.fn.primaryColor();
	const isDark = theme.colorScheme === "dark";

	return {
		tabsList: {
			borderBottom: "0 !important",
		},

		tab: {
			fontWeight: 500,
			borderBottom: 0,
			color: theme.white,

			"&:hover": {
				backgroundColor: theme.fn.darken(background, 0.1),
				boxShadow: theme.shadows.lg,
			},

			"&[data-active]": {
				backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
				color: background,
				boxShadow: "none",
			},
		},
	};
});
