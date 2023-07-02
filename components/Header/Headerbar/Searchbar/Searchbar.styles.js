import { createStyles } from "@mantine/core";
import * as themeHelpers from "../../../../utils/theme-helpers";

export const useStyles = createStyles((theme) => {
	return {
		root: {
			width: "30%"
		},

		input: {
			backgroundColor: themeHelpers.getLightFilledBackground(theme, 0.1),
			color: theme.white,
			border: "1px",
			borderStyle: "solid",
			borderColor: themeHelpers.getLightFilledBackground(theme, 0.3),
			paddingLeft: theme.spacing.sm,
			paddingRight: theme.spacing.sm,
			borderRadius: theme.radius.sm,

			"::placeholder": {
				color: themeHelpers.getLightFilledBackground(theme, 0.7)
			},

			":focus": {
				borderColor: themeHelpers.getLightFilledBackground(theme, 0.7),

				"::placeholder": {
					color: "transparent"
				}
			}
		},

		rightSection: {
			width: "auto",
			paddingLeft: theme.spacing.xs,
			paddingRight: theme.spacing.xs
		}
	};
});
