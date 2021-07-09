import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";

import UserPanel from "../UserPanel";
import Header from "../Header";
import Footer from "../Footer";

const useStyles = makeStyles((theme) => ({
	root: {
		minHeight: "100vh",
		display: "flex",
		flexDirection: "column",
	},
	container: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
	footer: {
		marginTop: "auto",
	},
}));

export default function Layout({ children }) {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<UserPanel />
			<Header />
			<Container className={classes.container}>{children}</Container>
			<Footer className={classes.footer} />
		</div>
	);
}
