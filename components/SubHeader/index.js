import { makeStyles } from "@material-ui/core/styles";
import {
	Paper,
	Grid,
	AppBar,
	Toolbar,
	Button,
	TextField,
} from "@material-ui/core";
import Carousel from "react-material-ui-carousel";

const useStyles = makeStyles((theme) => ({
	root: {
		height: "400px",
	},
	carousel: {
		width: "100%",
		height: "100%",
	},
}));

export default function SubHeader() {
	const classes = useStyles();

	return (
		<Paper>
			<div className={classes.root}>
				<Carousel className={classes.carousel} navButtonsAlwaysVisible={true}>
					<img src="http://upload.vstanced.com/images/2019/01/11/fea5e4d3a76c537ef7085ca6ef8166a0.jpg" />
					<img src="http://upload.vstanced.com/images/2019/02/05/c04d2a711faa5241cf08ecfb579fd73a.jpg" />
					<img src="http://upload.vstanced.com/images/2019/06/18/1e02aee72aa3906dd65849fcc55ee8ae.jpg" />
				</Carousel>
			</div>
		</Paper>
	);
}
