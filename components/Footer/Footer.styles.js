import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
	root: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		paddingTop: theme.spacing.xl,
		paddingBottom: theme.spacing.xl,
	},

	divider: {
		width: "60%",
	},
}));
