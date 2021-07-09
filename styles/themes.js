import { createTheme } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import pink from "@material-ui/core/colors/pink";

const theme = createTheme({
	palette: {
		primary: blue,
		secondary: pink,
		type: "light",
	},
});

export default theme;
