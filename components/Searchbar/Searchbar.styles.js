import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => {
	return {
		root: {
			width: "25%",
		},

		rightSection: {
			width: "auto",
			paddingLeft: theme.spacing.xs,
			paddingRight: theme.spacing.xs,
		},
	};
});
