import { ButtonGroup, Button } from "@material-ui/core";

export default function NavBar() {
	return (
		<ButtonGroup variant="text" color="inherit">
			<Button>News</Button>

			<Button>Downloads</Button>

			<Button>About</Button>
		</ButtonGroup>
	);
}
