import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Container, Toolbar } from "@material-ui/core";

import NavBar from "./NavBar";
import SearchBar from "./SearchBar";
import UserInfo from "./UserInfo";

const useStyles = makeStyles({
	toolbar: {
		justifyContent: "space-between",
	},
});

export default function Header() {
	const classes = useStyles();

	return (
		<AppBar position="static">
			<Container>
				<Toolbar className={classes.toolbar}>
					<NavBar />

					<SearchBar />

					<UserInfo />
				</Toolbar>
			</Container>
		</AppBar>
	);
}
