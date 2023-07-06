import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => {
	return {
		header: {
			position: "sticky",
			top: 0,
			backgroundColor: theme.fn.primaryColor(),
			color: theme.white,
		},
	};
});
