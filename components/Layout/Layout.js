import { useWindowScroll } from "@mantine/hooks";
import { useStyles } from "./Layout.styles";
import {
	ActionIcon,
	Affix,
	Container,
	Tooltip,
	Transition,
} from "@mantine/core";
import { IconArrowUp } from "@tabler/icons-react";
import Header from "../Header";
import Footer from "../Footer";
import Modals from "../Modals";

export default function Layout({ children }) {
	const [scroll, scrollTo] = useWindowScroll();
	const { classes } = useStyles();

	return (
		<div className={classes.root}>
			<Header />

			<Container className={classes.content} size="xl" p="md">
				{children}
			</Container>

			<Footer />

			<Modals />

			<Affix>
				<Transition transition="slide-up" mounted={scroll.y > 10}>
					{(transitionStyles) => (
						<Tooltip
							label="Scroll to top"
							openDelay={250}
							transition="fade"
							transitionDuration={300}>
							<ActionIcon
								m="lg"
								variant="filled"
								color="blue"
								radius="xl"
								size="xl"
								style={transitionStyles}
								onClick={() => scrollTo({ y: 0 })}>
								<IconArrowUp />
							</ActionIcon>
						</Tooltip>
					)}
				</Transition>
			</Affix>
		</div>
	);
}
