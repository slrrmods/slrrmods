import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	root: {
		background: theme.palette.primary.main,
		height: "120px",
	},
}));

export default function Footer(props) {
	const classes = useStyles();

	return (
		<div {...props}>
			<div className={classes.root}>
				<Container>
					<Typography variant="h1">mano aqui é o footer ok</Typography>
				</Container>
			</div>
		</div>
	);
}
