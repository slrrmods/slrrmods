import { useStyles } from "./Footer.styles";
import { Footer as MantineFooter, Divider } from "@mantine/core";

export default function Footer() {
	const { classes } = useStyles();

	return (
		<MantineFooter className={classes.root}>
			<Divider
				className={classes.divider}
				labelPosition="center"
				label="SLRR Mods"
			/>
		</MantineFooter>
	);
}
