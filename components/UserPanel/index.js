import { makeStyles } from "@material-ui/core/styles";
import {
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Divider,
} from "@material-ui/core";
import Link from "next/link";

import { useDrawer } from "../../contexts/DrawerContext";

const useStyles = makeStyles({
	list: {
		width: 250,
	},
});

export default function Layout() {
	const classes = useStyles();
	const { drawerOpen, closeDrawer } = useDrawer();

	return (
		<Drawer anchor="right" open={drawerOpen} onClose={closeDrawer}>
			<List className={classes.list}>
				<Link href="/404">
					<ListItem button>
						<ListItemIcon></ListItemIcon>
						<ListItemText primary="teste" />
					</ListItem>
				</Link>

				<Divider />
			</List>
		</Drawer>
	);
}
