import { ActionIcon, Affix, Tooltip, Transition } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { IconArrowUp } from "@tabler/icons-react";

export function ScrollToTop() {
	const [scroll, scrollTo] = useWindowScroll();

	return (
		<Affix>
			<Transition transition="slide-up" mounted={scroll.y > 10}>
				{(transitionStyles) => (
					<Tooltip
						label="Scroll to top"
						openDelay={500}
						transitionProps={{
							transition: "fade",
							duration: 300,
						}}>
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
	);
}
