import { ThemeToggle } from "@/client/components";
import { Group, Tabs } from "@mantine/core";
import { useRouter } from "next/router";
import { useStyles } from "./NavBar.styles";

const tabs = [
	{
		path: "/",
		title: "Home",
	},
	{
		path: "/news",
		title: "News",
	},
	{
		path: "/downloads",
		title: "Downloads",
	},
	{
		path: "/forum",
		title: "Forum",
	},
	{
		path: "/roleplay",
		title: "Roleplay",
	},
	{
		path: "/about",
		title: "About",
	},
];

export function NavBar() {
	const { classes } = useStyles();
	const router = useRouter();
	// const { toggleTheme, isDark } = useThemeContext();

	const currentPath = `/${router.pathname.split("/")[1]}`;

	function onTabChange(value: string) {
		if (router.asPath === value) return;
		router.push(value);
	}

	return (
		<Group position="apart">
			<Tabs
				classNames={classes}
				value={currentPath}
				onTabChange={onTabChange}
				variant="outline">
				<Tabs.List>
					{tabs.map((tab) => {
						return (
							<Tabs.Tab key={tab.path} value={tab.path}>
								{tab.title}
							</Tabs.Tab>
						);
					})}
				</Tabs.List>
			</Tabs>

			<ThemeToggle />
		</Group>
	);
}
