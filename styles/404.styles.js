import { createStyles } from "@mantine/core";
import { themeHelpers } from "../utils";

export const useStyles = createStyles((theme) => ({
	root: {
		margin: "auto",
		display: "flex",
		flexDirection: "column",
		placeItems: "center",
		gap: theme.spacing.xl,
	},

	label: {
		lineHeight: "1",
		fontWeight: 900,
		fontSize: 220,
		color: themeHelpers.getFromConditional(
			theme,
			theme.colors.dark[4],
			theme.colors.gray[2]
		),
	},

	title: {
		fontWeight: 900,
		fontSize: 38,
	},

	description: {
		maxWidth: 500,
		textAlign: "center",
	},
}));
