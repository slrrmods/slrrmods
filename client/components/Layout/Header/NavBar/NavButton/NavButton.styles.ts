import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => {
	const background = theme.fn.primaryColor();
	const isDark = theme.colorScheme === "dark";

	return {
		root: {
			borderBottomLeftRadius: 0,
			borderBottomRightRadius: 0,

			"&:hover": {
				boxShadow: theme.shadows.lg,
			},

			"&[data-disabled]": {
				backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
				color: background,
			},
		},
	};
});
