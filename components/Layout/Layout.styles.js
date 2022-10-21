import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => {
	return {
		root: {
			minHeight: "100vh",
			display: "flex",
			flexDirection: "column",
		},

		content: {
			flex: "1 1 auto",
			display: "grid",
			width: "100%",
		},
	};
});
