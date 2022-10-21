import { createStyles } from "@mantine/core";
import { themeHelpers } from "../../utils";

export const useStyles = createStyles((theme) => {
	const background = themeHelpers.getFilledBackground(theme);
	const backgroundLight = themeHelpers.getLightFilledBackground(theme, 0.2);

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
			fontSize: theme.fontSizes.lg,
			height: 38,
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
