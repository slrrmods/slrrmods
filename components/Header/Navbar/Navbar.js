import { ActionIcon, Group, Tabs, Tooltip } from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useThemeContext } from "../../../contexts/ThemeContext";
import { useStyles } from "./Navbar.styles";

const tabs = [
	{
		path: "/",
		title: "Home"
	},
	{
		path: "/news",
		title: "News"
	},
	{
		path: "/downloads",
		title: "Downloads"
	},
	{
		path: "/forum",
		title: "Forum"
	},
	{
		path: "/roleplay",
		title: "Roleplay"
	},
	{
		path: "/about",
		title: "About"
	}
];

export default function Navbar() {
	const { classes } = useStyles();
	const router = useRouter();
	const { toggleTheme, isDark } = useThemeContext();

	const currentPath = `/${router.pathname.split("/")[1]}`;

	const onTabChange = (value) => {
		if (router.asPath === value) return;
		router.push(value);
	};

	return (
		<Group position="apart">
			<Tabs
				value={currentPath}
				onTabChange={onTabChange}
				classNames={{
					tabsList: classes.tabsList,
					tab: classes.tab
				}}>
				<Tabs.List>
					{tabs.map((t) => {
						return (
							<Tabs.Tab key={t.path} value={t.path}>
								{t.title}
							</Tabs.Tab>
						);
					})}
				</Tabs.List>
			</Tabs>

			<Tooltip
				position="bottom"
				openDelay={500}
				transition="fade"
				transitionDuration={300}
				label={isDark ? "Light mode" : "Dark mode"}>
				<ActionIcon
					my={-1}
					mx="sm"
					size="lg"
					variant="filled"
					color="blue"
					onClick={toggleTheme}>
					{isDark ? <IconSun /> : <IconMoonStars />}
				</ActionIcon>
			</Tooltip>
		</Group>
	);
}
