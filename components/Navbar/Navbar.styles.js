import { createStyles } from "@mantine/core";
import * as themeHelpers from "../../utils/theme-helpers";

export const useStyles = createStyles((theme) => {
	const background = themeHelpers.getFilledBackground(theme);
	const backgroundLight = themeHelpers.getDarkFilledBackground(theme, 0.1);

	const activeBackground = themeHelpers.getFromConditional(
		theme,
		theme.colors.dark[7],
		theme.white
	);

	const activeForeground = themeHelpers.getFromConditional(
		theme,
		backgroundLight,
		background
	);

	return {
		tabsList: {
			borderBottom: "0 !important",
		},

		tab: {
			fontWeight: 500,
			borderBottom: 0,
			color: theme.white,

			"&:hover": {
				backgroundColor: backgroundLight,
				boxShadow: theme.shadows.md,
			},

			"&[data-active]": {
				backgroundColor: activeBackground,
				color: activeForeground,
				boxShadow: "none",
			},
		},
	};
});
