import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
	root: {
		margin: "auto",
	},

	content: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
		gap: theme.spacing.lg,
	},
}));
