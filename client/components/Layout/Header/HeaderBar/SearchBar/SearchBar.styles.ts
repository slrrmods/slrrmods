import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => {
	const primaryColor = theme.fn.primaryColor();

	return {
		root: {
			width: "35%",
		},

		input: {
			backgroundColor: "transparent",
			color: theme.white,
			border: "1px",
			borderStyle: "solid",
			borderColor: theme.fn.lighten(primaryColor, 0.4),
			paddingLeft: theme.spacing.sm,
			paddingRight: theme.spacing.sm,
			borderRadius: theme.radius.md,

			"::placeholder": {
				color: theme.fn.lighten(primaryColor, 0.4),
			},

			":focus": {
				borderColor: theme.fn.lighten(primaryColor, 0.8),
			},
		},

		rightSection: {
			width: "auto",
			paddingLeft: theme.spacing.xs,
			paddingRight: theme.spacing.xs,
		},
	};
});
