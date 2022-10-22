import { createStyles } from "@mantine/core";
import { themeHelpers } from "../../utils";

export const useStyles = createStyles((theme) => {
	return {
		root: {
			width: "30%",
		},

		input: {
			backgroundColor: themeHelpers.getLightFilledBackground(theme, 0.1),
			color: theme.white,
			border: "1px",
			borderStyle: "solid",
			borderColor: themeHelpers.getLightFilledBackground(theme, 0.4),
			paddingLeft: theme.spacing.sm,
			paddingRight: theme.spacing.sm,
			borderRadius: theme.radius.sm,

			"::placeholder": {
				color: theme.colors.gray[4],
			},

			":focus": {
				borderColor: themeHelpers.getLightFilledBackground(theme, 0.6),
			},
		},

		rightSection: {
			width: "auto",
			paddingLeft: theme.spacing.xs,
			paddingRight: theme.spacing.xs,
		},
	};
});
