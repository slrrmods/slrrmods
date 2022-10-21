import { createStyles } from "@mantine/core";
import { themeHelpers } from "../../utils";

export const useStyles = createStyles((theme) => {
	const background = themeHelpers.getFilledBackground(theme);

	return {
		header: {
			position: "sticky",
			paddingTop: theme.spacing.sm,
			backgroundColor: background,
			color: theme.white,
			borderBottom: `2px solid ${background}`,
		},
	};
});
