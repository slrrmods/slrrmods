import { makeStyles } from "@material-ui/core/styles";
import { Paper, InputBase, IconButton } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		alignItems: "center",
		width: "50%",
	},
	input: {
		marginLeft: theme.spacing(1),
		flex: 1,
	},
	iconButton: {
		padding: 10,
	},
}));

export default function SearchBar() {
	const classes = useStyles();

	return (
		<Paper className={classes.root}>
			<InputBase className={classes.input} placeholder="Search" />
			<IconButton className={classes.iconButton} type="submit">
				<SearchIcon />
			</IconButton>
		</Paper>
	);
}
