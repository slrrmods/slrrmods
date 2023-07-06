import { createStyles } from "@mantine/core";

export const useStyles = createStyles(() => {
	return {
		root: {
			minHeight: "100dvh",
			display: "flex",
			flexDirection: "column",
		},

		content: {
			flex: "1 1 auto",
			width: "100%",
		},
	};
});
