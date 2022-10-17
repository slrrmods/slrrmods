import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
	root: {
		position: "sticky",
		top: "0",
		paddingTop: theme.spacing.sm,
		paddingBottom: theme.spacing.sm,
		paddingLeft: theme.spacing.lg,
		paddingRight: theme.spacing.lg,
		display: "flex",
		placeItems: "center",
		justifyContent: "space-between",
	},

	logo: {
		color: theme.fn.themeColor(),
	},

	menuButton: {
		minWidth: "150px",
		fontSize: theme.fontSizes.lg,
		fontWeight: "700",
	},
}));
